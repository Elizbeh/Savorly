import 'dotenv/config'; // Load environment variables
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

import express from 'express';
import { json } from 'express';
import db from './config/db.js'; // Import the pool from the db config
const app = express();

// Middleware
app.use(json());

// Verify Database Connection
db.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL database successfully!');
    connection.release(); // Don't forget to release the connection back to the pool
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err.message);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Savorly API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
