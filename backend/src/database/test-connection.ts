import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Test connection script started!');

async function testDatabaseConnection() {
  console.log('🔍 Testing MySQL database connection...');
  console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`📍 Port: ${process.env.DB_PORT || '3306'}`);
  console.log(`📍 User: ${process.env.DB_USER || 'root'}`);
  console.log(`📍 Database: ${process.env.DB_NAME || 'megainvest_db'}`);

  // First try to connect to MySQL server
  const serverConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  try {
    console.log('\n🔌 Testing connection to MySQL server...');
    const connection = await mysql.createConnection(serverConfig);
    await connection.execute('SELECT NOW()');
    console.log('✅ MySQL server connection successful');

    // Check if our app database exists
    const [rows] = await connection.execute(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [process.env.DB_NAME || 'megainvest_db']
    );

    if ((rows as any[]).length === 0) {
      console.log('⚠️  Application database does not exist');
      console.log('💡 Run: npm run db:init to set up the database');
    } else {
      console.log('✅ Application database exists');

      // Test connection to app database
      const appConfig = {
        ...serverConfig,
        database: process.env.DB_NAME || 'megainvest_db'
      };

      try {
        const appConnection = await mysql.createConnection(appConfig);
        await appConnection.execute('SELECT NOW()');
        console.log('✅ Application database connection successful');

        // Check if tables exist
        const [tablesResult] = await appConnection.execute(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = ?
        `, [process.env.DB_NAME || 'megainvest_db']);

        if ((tablesResult as any[]).length === 0) {
          console.log('⚠️  No tables found in database');
          console.log('💡 Run: npm run db:migrate to create tables');
        } else {
          console.log(`✅ Found ${(tablesResult as any[]).length} tables in database`);
          (tablesResult as any[]).forEach((row: any) => {
            console.log(`   📋 ${row.table_name || row.TABLE_NAME}`);
          });
        }

        await appConnection.end();
      } catch (error) {
        console.error('❌ Application database connection failed:', error);
      }
    }

    await connection.end();

  } catch (error) {
    console.error('❌ MySQL connection failed:', error);

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n💡 MySQL server is not running or not accessible');
        console.error('💡 Please ensure MySQL is installed and running');
        console.error('💡 If using Laragon, make sure MySQL is started in Laragon');
      } else if (error.message.includes('Access denied')) {
        console.error('\n💡 Authentication failed - check your credentials in .env file');
        console.error('💡 Default MySQL user is usually "root" with empty password for Laragon');
      } else if (error.message.includes('Unknown database')) {
        console.error('\n💡 Database does not exist');
        console.error('💡 Run: npm run db:setup to create the database');
      }
    }
  }
}

// Always run the test function
testDatabaseConnection();

export { testDatabaseConnection };
