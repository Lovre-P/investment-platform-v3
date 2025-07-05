import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pool, closePool } from './config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations(): Promise<void> {
  try {
    console.log('🚀 Starting database migrations...');

    // Read and execute base schema.sql
    const schemaPath = join(__dirname, 'schema.sql');
    if (!existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    const schema = readFileSync(schemaPath, 'utf8');

    const executeStatements = async (sql: string) => {
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (!statement.trim()) continue;
        try {
          await pool.execute(statement);
          console.log(`✅ Executed statement: ${statement.substring(0, 50)}...`);
        } catch (err) {
          console.error(`❌ Failed to execute statement: ${statement.substring(0, 50)}...`);
          throw err;
        }
      }
    };

    await executeStatements(schema);

    // Execute additional migration files if present
    const migrationsDir = join(__dirname, 'migrations');
    if (existsSync(migrationsDir)) {
      const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      for (const file of files) {
        console.log(`📄 Processing migration: ${file}`);
        const sql = readFileSync(join(migrationsDir, file), 'utf8');
        await executeStatements(sql);
      }
    }

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// If this file is run directly via `tsx src/database/migrate.ts`, execute migrations
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => closePool())
    .catch(err => {
      console.error('Migration script failed:', err);
      process.exit(1);
    });
}
