import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../models/users.js';

export const registerUser = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        // Check if the email is already in use
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password before storing it
        const password_hash = await bcrypt.hash(password, 10);

        // Call the function to create the user in the database
        const newUser = await createUser({ email, password_hash, first_name, last_name });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
            },
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
