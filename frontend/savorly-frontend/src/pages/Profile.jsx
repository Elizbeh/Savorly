import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';
import { useAuth } from '../contexts/AuthContext'; // ✅ Import auth context

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [userState, setUserState] = useState({ first_name: '', last_name: '', bio: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get('/api/profile', {
            withCredentials: true,
          });
          if (response.status !== 200) {
            throw new Error('Failed to fetch profile');
          }

          const data = response.data;
          setUserState(data);
          setUser(data); // ✅ Update global auth state
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setMessage('Error fetching profile. Please try again later.');
          navigate('/login');
        }
      };

      fetchUserProfile();
    } else {
      setUserState(user); // ✅ Sync local state with context
    }
  }, [user, setUser, navigate]);

  const handleSave = async () => {
    try {
      let newAvatarUrl = userState.avatar_url;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await api.post('/api/profile/avatar', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (avatarResponse.status !== 200) {
          throw new Error('Failed to upload avatar');
        }

        newAvatarUrl = avatarResponse.data.avatar_url;
      }

      const updatedProfile = {
        first_name: userState.first_name,
        last_name: userState.last_name,
        bio: userState.bio,
        avatar_url: newAvatarUrl,
      };

      const updateResponse = await api.put('/api/profile', updatedProfile, {
        withCredentials: true,
      });

      if (updateResponse.status !== 200) {
        throw new Error('Failed to update profile');
      }

      setUser(updatedProfile); // ✅ Update context
      setUserState(updatedProfile); // ✅ Update local
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile: ' + error.message);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>

      {message && (
        <p className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      <div className="profile-header">
        <img
          src={userState.avatar_url ? `${userState.avatar_url}?t=${Date.now()}` : defaultAvatar}
          alt="Profile"
          className="avatar-image"
          onError={(e) => (e.target.src = defaultAvatar)}
        />
        {isEditing && (
          <div>
            <input
              type="file"
              className="file-input"
              onChange={handleAvatarChange}
              accept="image/*"
            />
            <span>Click to change avatar</span>
          </div>
        )}
      </div>

      <div className={`profile-info ${isEditing ? 'profile-edit' : 'profile-view'}`}>
        <label className="input-label">First Name</label>
        <input
          type="text"
          name="first_name"
          className="text-input"
          value={userState.first_name || ''}
          disabled={!isEditing}
          placeholder="First Name"
          onChange={handleChange}
        />

        <label className="input-label">Last Name</label>
        <input
          type="text"
          name="last_name"
          className="text-input"
          value={userState.last_name || ''}
          disabled={!isEditing}
          placeholder="Last Name"
          onChange={handleChange}
        />

        <label className="input-label">Bio</label>
        <textarea
          name="bio"
          className="bio-input"
          value={userState.bio || ''}
          disabled={!isEditing}
          placeholder="Bio"
          onChange={handleChange}
        />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn save-btn" onClick={handleSave}>Save</button>
            <button className="btn cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
