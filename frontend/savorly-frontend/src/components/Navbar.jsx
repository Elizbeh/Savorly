import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/default_avatar.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import api from '../services/api';

const Navbar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/profile', {
          withCredentials: true,
        });
        console.log('Profile:', response.data);
        setUserProfile(response.data.profile || response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    toggleMobileMenu(false); // close menu on logout
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {isLandingPage ? (
          <span className="logo">
            <img src={logo} alt="Savorly Logo" className="logo-icon" />
          </span>
        ) : (
          <Link to="/home" className="logo" onClick={handleLinkClick}>
            <img src={logo} alt="Savorly Logo" className="logo-icon" />
          </Link>
        )}
      </div>

      {!isLandingPage && (
        <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/create-recipe" onClick={handleLinkClick}>Create Recipe</Link>
          <Link to="/saved-recipes" onClick={handleLinkClick}>Saved Recipes</Link>
          <Link to="/about" onClick={handleLinkClick}>About Us</Link>
          {user?.role === 'admin' &&
            location.pathname !== '/admin-dashboard' &&
            !location.pathname.startsWith('/admin') && (
              <Link to="/admin-dashboard" onClick={handleLinkClick}>
                Admin
              </Link>
          )}

          {userProfile && (
            <Link to="/" onClick={handleLogout} className="logout-btn">Logout</Link>
          )}
        </div>
      )}
      <div className="navbar-right">
        {isLandingPage ? (
          <Link to="/login" className="login-btn">Login</Link>
        ) : userProfile ? (
          <div className="user-info">
            <Link to="/profile" onClick={handleLinkClick}>
              <img
                src={userProfile.avatar_url || defaultAvatar}
                alt="User Avatar"
                className="user-avatar"
              />
            </Link>
          </div>
        ) : (
          <Link to="/profile" onClick={handleLinkClick}>
            <img src={defaultAvatar} alt="Default Avatar" className="user-avatar" />
          </Link>
        )}
      </div>

      {!isLandingPage && (
        <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
