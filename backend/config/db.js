import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectTimeout: 30000,
}).promise();

// Test the connection with async/await
const testConnection = async () => {
  try {
    const connection = await pool.getConnection(); // This is the correct async approach
    console.log("Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

testConnection();
export default pool;
