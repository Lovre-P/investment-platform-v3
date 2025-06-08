import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection to MySQL server (not our app database)
const setupConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const appDbName = process.env.DB_NAME || 'megainvest_db';

async function setupDatabase() {
  let connection;
  try {
    console.log('🔧 Setting up MySQL database...');

    // Connect to MySQL server
    connection = await mysql.createConnection(setupConfig);

    // Check if database exists
    const [rows] = await connection.execute(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [appDbName]
    );

    if ((rows as any[]).length === 0) {
      // Database doesn't exist, create it
      console.log(`📦 Creating database: ${appDbName}`);
      await connection.execute(`CREATE DATABASE \`${appDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✅ Database created successfully');
    } else {
      console.log(`✅ Database ${appDbName} already exists`);
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 Make sure MySQL is running on your system');
        console.error('💡 You can install MySQL from: https://dev.mysql.com/downloads/mysql/');
      } else if (error.message.includes('Access denied')) {
        console.error('💡 Check your database credentials in .env file');
      }
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
