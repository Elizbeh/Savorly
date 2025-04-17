import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/default_avatar.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext"; // 🔥 Use your AuthContext

const Navbar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 🧠 Grab user & logout from context

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data.profile || data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]); // ✅ react to user from context

  const handleLogout = async () => {
    await logout();       // 🌟 use context's logout
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {isLandingPage ? (
          <span className="logo">
            <img src={logo} alt="Savorly Logo" className="logo-icon" />
            <span className="logo-text">Savorly</span>
          </span>
        ) : (
          <Link to="/home" className="logo">
            <img src={logo} alt="Savorly Logo" className="logo-icon" />
            <span className="logo-text">Savorly</span>
          </Link>
        )}
      </div>

      {!isLandingPage && (
        <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/create-recipe">Create Recipe</Link>
          <Link to="/saved-recipes">Saved Recipes</Link>
          <Link to="/about">About Us</Link>
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
            <Link to="/profile">
              <img
                src={userProfile.avatar_url || defaultAvatar}
                alt="User Avatar"
                className="user-avatar"
              />
            </Link>
          </div>
        ) : (
          <Link to="/profile">
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
