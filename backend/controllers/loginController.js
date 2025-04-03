import dotenv from 'dotenv';
dotenv.config();
import { setRefreshTokenCookie } from '../utils/tokenUtils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../models/users.js';

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
      httpOnly: false,
      secure: false,
      sameSite: "Lax", // Allows cookies in most cases without cross-site restrictions
      path: "/",
      maxAge: 60 * 60 * 1000
    });
    

    // Set refresh token in cookies
    setRefreshTokenCookie(res, refreshToken);

    // Respond with user details
    res.status(200).json({ message: 'Login successful', token: accessToken, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
