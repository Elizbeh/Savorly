import fs from 'fs/promises';
import pool from '../config/db.js';
import path from 'path';

// Using import.meta.url to get the directory name
const runMigrations = async () => {
    try {
        // Using import.meta.url to get the current directory
        const __dirname = path.dirname(new URL(import.meta.url).pathname);

        // Construct the full path to the SQL file
        const sqlPath = path.join(__dirname, 'createTables.sql');

        // Read the SQL file containing table creation scripts
        let sql = await fs.readFile(sqlPath, 'utf8');
        
        // Replace Windows line endings with Unix line endings
        sql = sql.replace(/\r\n/g, '\n');

        console.log('Executing migration...');
        console.log(sql);  // Check if the SQL is being read correctly

        // Split the SQL script into individual statements
        const sqlStatements = sql.split(';').filter(statement => statement.trim() !== '');

        // Execute each SQL statement separately
        for (let statement of sqlStatements) {
            console.log('Executing SQL statement:', statement);  // Log each statement
            await pool.query(statement);
        }

        console.log('Migrations executed successfully! Tables are created');
    } catch (err) {
        console.error('Error executing Migrations: ', err);
    } finally {
        pool.end();
    }
};

runMigrations();
