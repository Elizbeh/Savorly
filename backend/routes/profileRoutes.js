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
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type' });
  }

  const avatarUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ avatar_url: avatarUrl });
});


export default router;
