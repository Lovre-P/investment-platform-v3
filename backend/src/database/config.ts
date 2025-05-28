import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initializeMockData } from './mock.js';

dotenv.config();

// Check if we should use mock database
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test';

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'megainvest_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  connectionLimit: 20,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

export const pool = mysql.createPool(config);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  if (USE_MOCK_DB) {
    console.log('🔧 Using mock database mode');
    await initializeMockData();
    return true;
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT NOW()');
    connection.release();
    console.log('✅ MySQL database connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    console.log('🔧 Falling back to mock database mode');
    await initializeMockData();
    return true; // Return true to allow server to start with mock data
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  if (!USE_MOCK_DB) {
    await pool.end();
    console.log('Database pool closed');
  }
};

export const isMockMode = () => USE_MOCK_DB;
