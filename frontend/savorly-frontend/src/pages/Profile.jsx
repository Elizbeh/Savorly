import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';
import { useAuth } from '../contexts/AuthContext';
import { FaExclamationCircle } from 'react-icons/fa';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [userState, setUserState] = useState({ first_name: '', last_name: '', bio: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile', { withCredentials: true });
        if (res.status !== 200) throw new Error('Fetch failed');
        setUserState(res.data);
        setUser(res.data);
      } catch {
        setMessage('Error fetching profile. Redirecting to login.');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [setUser, navigate]);

  useEffect(() => { if (userState.avatar_url) setAvatarKey(Date.now()); }, [userState.avatar_url]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 5000); return () => clearTimeout(timer); }, [message]);

  const handleSave = async () => {
    try {
      setLoading(true);
      let newAvatarUrl = userState.avatar_url;
      if (avatarFile) {
        if (!ALLOWED_TYPES.includes(avatarFile.type)) return setMessage('Invalid avatar type.');
        if (avatarFile.size > MAX_AVATAR_SIZE) return setMessage('Avatar too large.');
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarRes = await api.post('/api/profile/avatar', formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }});
        if (avatarRes.status !== 200) throw new Error('Upload failed');
        newAvatarUrl = avatarRes.data.avatar_url;
        setAvatarFile(null);
      }
      const updateRes = await api.put('/api/profile', { ...userState, avatar_url: newAvatarUrl }, { withCredentials: true });
      if (updateRes.status !== 200) throw new Error('Update failed');
      const refreshed = await api.get('/api/profile', { withCredentials: true });
      setUser(refreshed.data);
      setUserState(refreshed.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return setMessage('File must be an image.');
    if (file.size > MAX_AVATAR_SIZE) return setMessage('Image must be under 5MB.');
    setAvatarFile(file);
  };

  const handleChange = (e) => setUserState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const getAvatarUrl = (url) => !url ? defaultAvatar : `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`} role="alert">
          {message.includes('Failed') && <FaExclamationCircle size={24} className="alert-icon" />}
          <p>{message}</p>
        </div>
      )}

      <div className="profile-header">
        <div className="avatar-wrapper">
          <img key={avatarKey} src={getAvatarUrl(userState.avatar_url)} alt="Profile avatar" className="avatar-image" />
          {isEditing && (
            <label htmlFor="avatarUpload" className="avatar-overlay" aria-label="Change avatar">
              <input id="avatarUpload" type="file" className="file-input" onChange={handleAvatarChange} accept="image/*" disabled={loading} />
              <span className="avatar-edit-text">Change</span>
            </label>
          )}
        </div>
      </div>

      <div className={`profile-info ${isEditing ? 'editing' : 'view'}`}>
        <label className="input-label" htmlFor="first_name">First Name</label>
        <input id="first_name" type="text" name="first_name" value={userState.first_name || ''} onChange={handleChange} disabled={!isEditing || loading} placeholder="First Name" className="text-input" />

        <label className="input-label" htmlFor="last_name">Last Name</label>
        <input id="last_name" type="text" name="last_name" value={userState.last_name || ''} onChange={handleChange} disabled={!isEditing || loading} placeholder="Last Name" className="text-input" />

        <label className="input-label" htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" value={userState.bio || ''} onChange={handleChange} disabled={!isEditing || loading} placeholder="Bio" className="bio-input" />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn save-btn" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button className="btn cancel-btn" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
          </>
        ) : (
          <button className="btn edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
