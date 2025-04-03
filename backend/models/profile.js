import db from '../config/db.js';

// Create user profile
export const createUserProfile = async (userId) => {
  if (!userId) {
      throw new Error('User ID is required to create a profile');
  }

  const defaultAvatarUrl = 'http://localhost:5001/uploads/default_avatar.png';
  const query = 'INSERT INTO user_profiles (user_id, bio, avatar_url) VALUES (?, ?, ?)';

  try {
      const [result] = await db.query(query, [userId, '', defaultAvatarUrl]);
      return result;
  } catch (err) {
      console.error('Error creating user profile:', err);
      throw new Error('Profile creation failed');
  }
};

// Get a profile by user ID
export const getProfileByUserId = async (userId) => {
  const query = 'SELECT * FROM user_profiles WHERE user_id = ?';
  const [rows] = await db.query(query, [userId]);
  return rows[0]; // Return the first matching profile
};

// Update profile for a specific user
export const updateProfile = async (userId, profileData) => {
  const { bio, avatar_url } = profileData;

  // Check if the profile exists
  const [existingProfile] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);

  if (!existingProfile.length) {
    // If no profile exists, create one
    try {
      await db.query('INSERT INTO user_profiles (user_id, bio, avatar_url) VALUES (?, ?, ?)', [userId, bio, avatar_url]);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }
  } else {
    // Update the existing profile
    try {
      const [result] = await db.query('UPDATE user_profiles SET bio = ?, avatar_url = ? WHERE user_id = ?', [bio, avatar_url, userId]);

      if (result.affectedRows === 0) {
        throw new Error(`Profile update failed for user ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};

