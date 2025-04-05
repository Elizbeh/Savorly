import { getProfileByUserId, updateProfile } from '../models/profile.js';


export const getUserProfile = async (req, res) => {
  console.log('Decoded User:', req.user);

  const userId = req.user.id;  // Get user ID from the authenticated user
  

  try {
    const userProfile = await getProfileByUserId(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(userProfile); // Send the profile data as a JSON response
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
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
