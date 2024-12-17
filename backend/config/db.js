import { createPool } from 'mysql2';
import 'dotenv/config';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}).promise();

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log("Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default pool;
