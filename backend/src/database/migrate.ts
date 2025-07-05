import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pool } from './config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');

    // Read and execute base schema.sql
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    const executeStatements = async (sql: string) => {
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await pool.execute(statement);
        }
      }
    };

    await executeStatements(schema);

    // Execute additional migration files if present
    const migrationsDir = join(__dirname, 'migrations');
    if (existsSync(migrationsDir)) {
      const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      for (const file of files) {
        const sql = readFileSync(join(migrationsDir, file), 'utf8');
        await executeStatements(sql);
      }
    }

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Always run migrations when this file is executed
console.log('🚀 Migration script started!');
runMigrations();

export { runMigrations };
