import db from '../config/db.js';


export const createUser = async (userData) => {
    const {email, password_hash, first_name, last_name} = userData;
    const query = 'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [email, password_hash, first_name, last_name]);
    return {id: result.insertId, email, first_name, last_name};
};

// Get a user by email
export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users Where email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
};