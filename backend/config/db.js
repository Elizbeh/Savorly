import { createPool } from 'mysql2';
import 'dotenv/config'; // Load environment variables from .env file

// Create a MySQL connection
const pool = createPool({
  host: process.env.DB_HOST,   // Database host (localhost)
  user: process.env.DB_USER,   // Database user
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,    // Database name
  
}).promise();

// Export the connection pool for use in other parts of the application
export default pool;
