import React, { useState, useEffect } from 'react'; 
import api from '../services/api';
import Cookies from 'js-cookie';
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';

const ProfilePage = () => {
  const [user, setUser] = useState({ first_name: '', last_name: '', bio: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/profile");
        setUser(response.data.profile || { first_name: '', last_name: '', bio: '', avatar_url: '' }); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      let newAvatarUrl = user.avatar_url;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await api.post('/api/profile/avatar', formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        newAvatarUrl = avatarResponse.data.avatar_url;
      }

      await api.put('/api/profile', { 
        first_name: user.first_name, 
        last_name: user.last_name, 
        bio: user.bio, 
        avatar_url: newAvatarUrl 
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUser(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile');
    }
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>

      {message && <p className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</p>}

      <div className="profile-header">
        <img
          src={user.avatar_url ? `${user.avatar_url}?t=${Date.now()}` : defaultAvatar}
          alt="Profile"
          className="avatar-image"
          onError={(e) => e.target.src = defaultAvatar}
        />
        {isEditing && <input type="file" className="file-input" onChange={handleAvatarChange} />}
      </div>

      <div className={`profile-info ${isEditing ? 'profile-edit' : 'profile-view'}`}>
  <label className="input-label">First Name</label>
  <input
    type="text"
    name="first_name"
    className="text-input"
    value={user.first_name || ''}
    disabled={!isEditing}
    placeholder="First Name"
    onChange={handleChange}
  />

  <label className="input-label">Last Name</label>
  <input
    type="text"
    name="last_name"
    className="text-input"
    value={user.last_name || ''}
    disabled={!isEditing}
    placeholder="Last Name"
    onChange={handleChange}
  />

  <label className="input-label">Bio</label>
  <textarea
    name="bio"
    className="bio-input"
    value={user.bio || ''}
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
