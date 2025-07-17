import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';
import { useAuth } from '../contexts/AuthContext';
import { FaExclamationCircle } from 'react-icons/fa';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [userState, setUserState] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/profile', { withCredentials: true });
        if (response.status !== 200) throw new Error('Failed to fetch profile');
        const data = response.data;
        setUserState(data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setMessage('Error fetching profile. Please try again later.');
        navigate('/login');
      }
    };
    fetchUserProfile();
  }, [setUser, navigate]);

  useEffect(() => {
    if (userState.avatar_url) {
      setAvatarKey(Date.now());
    }
  }, [userState.avatar_url]);

  // Auto clear messages after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSave = async () => {
    try {
      setLoading(true);
      let newAvatarUrl = userState.avatar_url;

      if (avatarFile) {
        // Client-side validation
        if (!ALLOWED_TYPES.includes(avatarFile.type)) {
          setMessage('Invalid avatar file type.');
          setLoading(false);
          return;
        }
        if (avatarFile.size > MAX_AVATAR_SIZE) {
          setMessage('Avatar file size must be under 5MB.');
          setLoading(false);
          return;
        }

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
        setAvatarFile(null);
      }

      const updatedProfile = {
        first_name: userState.first_name,
        last_name: userState.last_name,
        bio: userState.bio,
        avatar_url: newAvatarUrl,
      };

      const updateResponse = await api.put('/api/profile', updatedProfile, { withCredentials: true });

      if (updateResponse.status !== 200) {
        throw new Error('Failed to update profile');
      }

      const refreshed = await api.get('/api/profile', { withCredentials: true });

      setUser(refreshed.data);
      setUserState(refreshed.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    setMessage('Selected file must be an image.');
    return;
  }

  if (file.size > MAX_AVATAR_SIZE) {
    setMessage('Image must be under 5MB.');
    return;
  }

  setAvatarFile(file);
};


  const handleChange = (e) => {
    setUserState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getAvatarUrl = (url) => {
    if (!url || url.trim() === '') return defaultAvatar;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>

      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message.includes('Failed') && <FaExclamationCircle size={24} style={{ marginRight: '10px', color: '#fff' }} />}
          <p>{message}</p>
        </div>
      )}

      <div className="profile-header">
        {userState.avatar_url ? (
          <img
            key={avatarKey}
            src={getAvatarUrl(userState.avatar_url)}
            alt="Profile"
            className="avatar-image"
            onError={() => console.warn('Failed to load avatar')}
          />
        ) : (
          <img src={defaultAvatar} alt="Default Avatar" className="avatar-image" />
        )}

        {isEditing && (
          <div className="file-input-container">
            <input
              id="avatarUpload"
              type="file"
              className="file-input"
              onChange={handleAvatarChange}
              accept="image/*"
              disabled={loading}
            />
            <label htmlFor="avatarUpload" className="custom-file-label">
              Choose Avatar
            </label>
            <span className="file-instruction">Click to change avatar</span>
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
          disabled={!isEditing || loading}
          placeholder="First Name"
          onChange={handleChange}
        />

        <label className="input-label">Last Name</label>
        <input
          type="text"
          name="last_name"
          className="text-input"
          value={userState.last_name || ''}
          disabled={!isEditing || loading}
          placeholder="Last Name"
          onChange={handleChange}
        />

        <label className="input-label">Bio</label>
        <textarea
          name="bio"
          className="bio-input"
          value={userState.bio || ''}
          disabled={!isEditing || loading}
          placeholder="Bio"
          onChange={handleChange}
        />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn save-btn" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button className="btn cancel-btn" onClick={() => setIsEditing(false)} disabled={loading}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
