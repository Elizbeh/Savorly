import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/default_avatar.png";
import "./Navbar.css";
import Cookies from 'js-cookie';

const Navbar = ({ user, isMobileMenuOpen, toggleMobileMenu }) => {
  const [userProfile, setUserProfile] = useState(null);
  const authToken = Cookies.get('authToken');
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Auth Token:", authToken);

  // Fetch user profile inside useEffect
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Auth Token in Navbar:", Cookies.get("authToken"));
      if (!authToken) return;
      
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setUserProfile(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [authToken]);
  
  // Logout function
  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Cookies.remove('authToken');
        navigate("/login");
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src={logo} alt="Savorly Logo" className="logo-icon" />
          <span className="logo-text">Savorly</span>
        </Link>
      </div>

      <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="/create-recipe">Create Recipe</Link>
        <Link to="/saved-recipes">Saved Recipes</Link>
        {authToken && (
          <Link to="#" onClick={logout} className="logout-btn">Logout</Link>
        )}
      </div>

      <div className="navbar-right">
  {userProfile ? (
    <div className="user-info">
      <Link to="/profile">
        <img 
          src={userProfile.avatar_url || defaultAvatar} 
          alt="User Avatar" 
          className="user-avatar" 
        />
      </Link>
      <span className="user-name">{userProfile.first_name} {userProfile.last_name}</span>
    </div>
  ) : (
    <div className="user-info">
      <Link to="/profile">
        <img src={defaultAvatar} alt="Default Avatar" className="user-avatar" />
      </Link>
    </div>
  )}

  
</div>


      <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
