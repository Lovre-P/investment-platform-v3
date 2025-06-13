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

    // For Railway, we need to create the database first
    if (process.env.DATABASE_URL) {
      console.log('🚂 Railway environment detected, creating database if needed');

      // Parse the DATABASE_URL to get connection details without database name
      const dbUrl = new URL(process.env.DATABASE_URL);
      const dbName = dbUrl.pathname.slice(1); // Remove leading slash

      // Connect without specifying database
      const baseUrl = `mysql://${dbUrl.username}:${dbUrl.password}@${dbUrl.host}:${dbUrl.port || 3306}`;
      connection = await mysql.createConnection(baseUrl);

      // Create database if it doesn't exist
      console.log(`📦 Creating database: ${dbName}`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✅ Database created/verified successfully');
      return;
    }

    // Connect to MySQL server (local development)
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
