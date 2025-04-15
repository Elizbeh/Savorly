import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../models/users.js';
import { setRefreshTokenCookie } from '../utils/tokenUtils.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user from DB
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the email is verified
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate Refresh Token (longer-lived)
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Set access token in a cookie
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use https in production
      sameSite: 'None', // Allows cookies in most cases without cross-site restrictions
      path: '/',  // Set path to root, making cookie accessible across your app
      maxAge: 60 * 60 * 1000, // 1 hour expiration for the access token
    });

    // Set refresh token in cookies
    setRefreshTokenCookie(res, refreshToken);

    // Respond with user details (excluding token)
    res.status(200).json({
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
