import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../services/api'; // Assuming you have api.js to handle api calls
import './Profile.css';
import defaultAvatar from '../assets/images/default_avatar.png';

const ProfilePage = () => {
  const [user, setUser] = useState({ first_name: '', last_name: '', bio: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');
  const authToken = Cookies.get('authToken'); // Get authToken from cookies
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    if (!authToken) {
      // Redirect to login if authToken is missing
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/profile/', {
          method: 'GET',
          credentials: 'include',  
        });
    
        const responseText = await response.text(); // ⬅️ Grab raw text
        console.log('Raw response:', responseText); // ⬅️ See what came back
    
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
    
        const data = JSON.parse(responseText); // ⬅️ Try to parse it now
        console.log('Fetched profile:', data);
        setUser(data);
    
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setMessage('Error fetching profile. Please try again later.');
      }
    };
    

    fetchUserProfile();
  }, [authToken, navigate]); 

  const handleSave = async () => {
    try {
      let newAvatarUrl = user.avatar_url;

      // If avatar file exists, upload it
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await api.post('/api/profile/avatar', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });
        

        newAvatarUrl = avatarResponse.data.avatar_url;
      }

      const handleSave = async () => {
        try {
          let newAvatarUrl = user.avatar_url;
      
          // If avatar file exists, upload it
          if (avatarFile) {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
      
            // Use full URL for avatar upload
            const avatarResponse = await api.post('http://localhost:5001/api/profile/avatar', formData, {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            newAvatarUrl = avatarResponse.data.avatar_url;
          }
      
          // Use full URL for updating the profile data
          await api.put('http://localhost:5001/api/profile/', {
            first_name: user.first_name,
            last_name: user.last_name,
            bio: user.bio,
            avatar_url: newAvatarUrl,
          }, {
            withCredentials: true,
          });
      
          // Update the state with the new avatar URL
          setUser((prev) => ({ ...prev, avatar_url: newAvatarUrl }));
          setMessage('Profile updated successfully!');
          setIsEditing(false);
        } catch (error) {
          console.error('Error saving profile:', error);
          setMessage('Failed to save profile');
        }
      };
      
      

      // Update the state with the new avatar URL
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
        {/* Display user avatar or default if no avatar is set */}
        <img
          src={user.avatar_url ? `${user.avatar_url}?t=${Date.now()}` : defaultAvatar}
          alt="Profile"
          className="avatar-image"
          onError={(e) => e.target.src = defaultAvatar} // Handle error if avatar image is broken
        />
        {isEditing && <input type="file" className="file-input" onChange={handleAvatarChange} />}
      </div>

      <div className={`profile-info ${isEditing ? 'profile-edit' : 'profile-view'}`}>
        {/* Editable fields for first name, last name, and bio */}
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
