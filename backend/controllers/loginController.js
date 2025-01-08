import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/users.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password stored in DB
        const isMatched = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', isMatched);

        if (!isMatched) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a JWT token if password is correct
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7h' }
        );
        console.log('Generated token:', token);

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
