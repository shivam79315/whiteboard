import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'whiteboard',
  password: process.env.DB_PASSWORD || 'whiteboard',
  database: process.env.DB_NAME || 'whiteboard',
});


// Initialize database connection
export const initDB = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('PostgreSQL connection failed', error);
    throw error;
  }
};

export default pool;