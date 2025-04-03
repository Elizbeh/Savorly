import { getProfileByUserId, updateProfile } from '../models/profile.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing from request' });
  }

  try {
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile fetched successfully', profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { bio, avatar_url } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing from request' });
  }

  // Validate bio: Should be a string if present
  if (bio && typeof bio !== 'string') {
    return res.status(400).json({ message: 'Bio must be a string' });
  }

  // Validate avatar_url: Should be a string if present
  if (avatar_url && typeof avatar_url !== 'string') {
    return res.status(400).json({ message: 'Avatar URL must be a string' });
  }

  try {
    // Set default values if necessary
    const updatedProfileData = {
      bio: bio || '',  // Default to empty string if bio is not provided
      avatar_url: avatar_url || 'http://localhost:5001/uploads/default_avatar.png', // Default avatar if not provided
    };

    // Call the model function to update the profile
    await updateProfile(userId, updatedProfileData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};
