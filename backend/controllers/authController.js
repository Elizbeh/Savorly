import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

import { createUser, getUserByEmail, updateUserVerificationToken } from '../models/users.js';
import { sendEmail } from '../services/emailService.js';

const generateVerificationToken = () => uuidv4();

export const registerUser = async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);
        const verification_token = generateVerificationToken();

        // Create the user
        const newUser = await createUser({
            email,
            password_hash,
            first_name,
            last_name,
            role,
            verification_token,
            verification_token_expires_at: new Date(Date.now() + 3600000),
        });

        // Create the verification URL
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(verification_token)}`;
        console.log("Generated verification URL:", verificationUrl);

        // Send verification email
        await sendEmail(email, first_name, verificationUrl);

        // Respond with success
        res.status(201).json({
            message: 'User created successfully. Please check your email to verify your account.',
            user: {
                id: newUser.id,
                email: newUser.email,
                first_name,
                last_name,
                role,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user?.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const verificationToken = generateVerificationToken();
        
console.log("Generated Token:", verificationToken);

        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour

        await updateUserVerificationToken(user.id, verificationToken, tokenExpiration);

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;
        await sendEmail(email, user.first_name, verificationUrl);

        res.status(200).json({ message: 'A new verification email has been sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, role: decoded.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

export const getUserData = async (req, res) => {
    try {
      const userId = req.user?.id; // safely access user ID
  
      if (!userId) {
        return res.status(400).json({ message: "Invalid or missing user ID" });
      }
  
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

export const logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
