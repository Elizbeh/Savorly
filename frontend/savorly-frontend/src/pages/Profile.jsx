import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';
import { useAuth } from '../contexts/AuthContext';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile', { withCredentials: true });
        setUserState(res.data);
        setUser(res.data);
      } catch (err) {
        setMessage({ text: 'Failed to load profile. Redirecting...', type: 'error' });
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchProfile();
  }, [setUser, navigate]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSave = async () => {
    try {
      setLoading(true);
      let newAvatarUrl = userState.avatar_url;

      if (avatarFile) {
        if (!ALLOWED_TYPES.includes(avatarFile.type)) {
          setMessage({ text: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.', type: 'error' });
          setLoading(false);
          return;
        }
        if (avatarFile.size > MAX_AVATAR_SIZE) {
          setMessage({ text: 'File too large. Maximum size is 5MB.', type: 'error' });
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarRes = await api.post('/api/profile/avatar', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newAvatarUrl = avatarRes.data.avatar_url;
        setAvatarFile(null);
        setAvatarPreview(null);
      }

      await api.put('/api/profile', { ...userState, avatar_url: newAvatarUrl }, { withCredentials: true });
      const refreshed = await api.get('/api/profile', { withCredentials: true });
      setUser(refreshed.data);
      setUserState(refreshed.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file.', type: 'error' });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setMessage({ text: 'Image must be under 5MB.', type: 'error' });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setUserState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset to original user data
    if (user) {
      setUserState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || ''
      });
    }
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (userState.avatar_url) return `${userState.avatar_url}?t=${Date.now()}`;
    return defaultAvatar;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`profile-alert ${message.type}`} role="alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {message.type === 'success' ? (
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l7.59-7.59L18 6l-9 9z" fill="currentColor"/>
              ) : (
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
              )}
            </svg>
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img src={getAvatarUrl()} alt="Profile" className="avatar-image" />
              {isEditing && (
                <label className="avatar-edit-button" htmlFor="avatarUpload">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm7-2h-2.59l-1.7-1.7A1 1 0 0014 1H6a1 1 0 00-.71.29L3.59 3H1C.45 3 0 3.45 0 4v12c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-7 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>
                  </svg>
                  <span>Change Photo</span>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            {avatarPreview && (
              <p className="avatar-hint">New photo selected. Click Save to update.</p>
            )}
          </div>

          {/* Form Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={userState.first_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={userState.last_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={userState.bio || ''}
                onChange={handleChange}
                disabled={!isEditing || loading}
                placeholder="Tell us about yourself..."
                rows="4"
              />
              <span className="field-hint">
                {userState.bio?.length || 0} / 500 characters
              </span>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              {isEditing ? (
                <>
                  <button
                    className="btn-action save"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="25"/>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M15 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM5 4h10v8H5V4zm0 12v-2h10v2H5z" fill="currentColor"/>
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    className="btn-action cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn-action edit"
                  onClick={() => setIsEditing(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 14.375v3.125h3.125l9.217-9.217-3.125-3.125L2.5 14.375zm14.758-8.508a.83.83 0 000-1.175L15.308 2.74a.83.83 0 00-1.175 0l-1.633 1.634 3.125 3.125 1.633-1.633z" fill="currentColor"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;