import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/default_avatar.png";
import "./Navbar.css";

const Navbar = ({  user, isMobileMenuOpen, toggleMobileMenu }) => {
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are on the landing page
  const isLandingPage = location.pathname === "/";

  // Fetch user profile inside useEffect
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
      setUserProfile(data.profile || data); // Ensure you update the profile here
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (user) {
    fetchUserProfile();
  }
}, [user]);  // Now using the user prop correctly

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies during logout
      });

      if (response.ok) {
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
        {/* On the landing page, use span to prevent navigation, otherwise, use Link */}
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

      {/* Conditionally render nav-links only if we are not on the landing page */}
      {!isLandingPage && (
        <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/create-recipe">Create Recipe</Link>
          <Link to="/saved-recipes">Saved Recipes</Link>
          <Link to="/about">About Us</Link> {/* New Link for About Us */}
          {userProfile && (
            <Link to="/" onClick={logout} className="logout-btn">Logout</Link>
          )}
        </div>
      )}

      {/* Conditionally render login button on landing page */}
      <div className="navbar-right">
        {isLandingPage ? (
          <Link to="/login" className="login-btn">Login</Link>
        ) : userProfile ? (
          <div className="user-info">
            {/* Check if the user is authenticated before navigating to /profile */}
            <Link to={userProfile ? "/profile" : "/login"}>
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

      {/* Conditionally render the hamburger menu only if we are not on the landing page */}
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
