import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, updateUserVerificationToken } from '../models/users.js';
import { sendEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import { getProfileByUserId, updateProfile } from '../models/profile.js';

const generateVerificationToken = () => uuidv4();

export const registerUser = async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        const newUser = await createUser({
            email,
            password_hash,
            first_name,
            last_name,
            role,
            verification_token: verificationToken,
            verification_token_expires_at: new Date(Date.now() + 3600000),
        });

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;
        sendEmail(email, 'Verify your Email', first_name, verificationUrl);

        res.status(201).json({
            message: 'User created successfully. Please check your email to verify your account.',
            user: { id: newUser.id, email: newUser.email, first_name, last_name, role },
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
  
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
  
    if (user.is_verified) {
        return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken();
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    await updateUserVerificationToken(user.id, verificationToken, tokenExpiration);
  
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;
    sendEmail(email, 'Verify your Email', user.first_name, verificationUrl);
  
    res.status(200).json({ message: 'A new verification email has been sent. Please check your inbox.' });
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Create a new refresh token on every refresh
      const newRefreshToken = jwt.sign(
          { userId: decoded.userId, email: decoded.email, role: decoded.role },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' }
      );

      // Set the new refresh token in the cookie
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

      // Create new access token
      const newAccessToken = jwt.sign(
          { userId: decoded.userId, email: decoded.email, role: decoded.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
  }
};


export const logoutUser = (req, res) => {
    res.clearCookie('refreshToken');  
    res.status(200).json({ message: 'Logged out successfully' });
};
