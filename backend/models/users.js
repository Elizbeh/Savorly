import pool from '../config/db.js';
import { createUserProfile } from './profile.js';

export const createUser = async (userData) => {
    try {
        const { email, password_hash, first_name, last_name, role = 'user', verification_token } = userData;
        
        // Set token expiration (1 hour from now)
        const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);  // 1 hour
        
        const query = ` 
            INSERT INTO users 
            (email, password_hash, first_name, last_name, role, verification_token, verification_token_expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.query(query, [
            email, 
            password_hash, 
            first_name, 
            last_name, 
            role, 
            verification_token,  
            tokenExpiration
        ]);

        const userId = result.insertId;

        // Ensure profile is created for the user (handle errors)
        try {
            await createUserProfile(userId);
        } catch (profileError) {
            console.error('Error creating user profile:', profileError);
        }

        return { id: userId, email, first_name, last_name, role };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        return rows[0] || null;
    } catch (err) {
        console.error("Error fetching user by email:", err);
        throw new Error('Database query failed');
    }
};

export const getUserById = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        throw new Error('Database query failed');
    }
};

export const getUserByToken = async (token) => {
    console.log('Received token in backend:', token);
    try {
        const query = 'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires_at > NOW()';
        const [users] = await pool.query(query, [token]);
        return users.length > 0 ? users[0] : null;  // Fix: use users[0] instead of rows[0]
    } catch (err) {
        console.log('User found with token:', users);
        throw err;
    }
};


export const updateUserVerificationToken = async (userId, token, expiration) => {
    try {
        const [result] = await pool.execute(query, [token, expiration, userId]);
        console.log("Update result:", result);
    } catch (err) {
        console.error('Error updating verification token:', err);
        throw new Error('Database update failed');
    }
  };
  
