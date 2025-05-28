import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`📍 Port: ${process.env.DB_PORT || '5432'}`);
  console.log(`📍 User: ${process.env.DB_USER || 'postgres'}`);
  console.log(`📍 Database: ${process.env.DB_NAME || 'megainvest_db'}`);

  // First try to connect to postgres database
  const postgresPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    console.log('\n🔌 Testing connection to PostgreSQL server...');
    const client = await postgresPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL server connection successful');

    // Check if our app database exists
    const dbCheckResult = await postgresPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_NAME || 'megainvest_db']
    );

    if (dbCheckResult.rows.length === 0) {
      console.log('⚠️  Application database does not exist');
      console.log('💡 Run: npm run db:init to set up the database');
    } else {
      console.log('✅ Application database exists');
      
      // Test connection to app database
      const appPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'megainvest_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
      });

      try {
        const appClient = await appPool.connect();
        await appClient.query('SELECT NOW()');
        appClient.release();
        console.log('✅ Application database connection successful');
        
        // Check if tables exist
        const tablesResult = await appPool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        
        if (tablesResult.rows.length === 0) {
          console.log('⚠️  No tables found in database');
          console.log('💡 Run: npm run db:migrate to create tables');
        } else {
          console.log(`✅ Found ${tablesResult.rows.length} tables in database`);
          tablesResult.rows.forEach(row => {
            console.log(`   📋 ${row.table_name}`);
          });
        }
        
        await appPool.end();
      } catch (error) {
        console.error('❌ Application database connection failed:', error);
        await appPool.end();
      }
    }

  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n💡 PostgreSQL server is not running or not accessible');
        console.error('💡 Please ensure PostgreSQL is installed and running');
        console.error('💡 Installation guides:');
        console.error('   - Windows: https://www.postgresql.org/download/windows/');
        console.error('   - macOS: brew install postgresql');
        console.error('   - Linux: sudo apt-get install postgresql');
      } else if (error.message.includes('authentication failed')) {
        console.error('\n💡 Authentication failed - check your credentials in .env file');
        console.error('💡 Default PostgreSQL user is usually "postgres"');
      } else if (error.message.includes('does not exist')) {
        console.error('\n💡 Database user does not exist');
        console.error('💡 Create user with: createuser -s your_username');
      }
    }
  } finally {
    await postgresPool.end();
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConnection();
}

export { testDatabaseConnection };
