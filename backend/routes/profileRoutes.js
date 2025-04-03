import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get user profile
router.get('/', authenticate, (req, res, next) => {
  console.log("User in request:", req.user);
  next();
}, getUserProfile);

// Update user profile (bio and avatar_url)
router.put('/', authenticate, updateUserProfile);

// Upload avatar image
router.post('/avatar', authenticate, upload.single('avatar'), (req, res) => {
  try {
    // Build the public URL for the uploaded image
    const avatarUrl = `http://localhost:5001/uploads/${req.file.filename}`;

    // Respond with the new avatar URL
    res.json({ avatar_url: avatarUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

export default router;
