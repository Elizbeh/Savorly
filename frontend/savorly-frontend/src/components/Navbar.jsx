import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import defaultAvatar from "../assets/images/default_avatar.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import api from '../services/api';

const Navbar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLandingPage = location.pathname === "/";

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get('/api/profile', {
          withCredentials: true,
        });
        setUserProfile(response.data.profile || response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && navRef.current && !navRef.current.contains(event.target)) {
        toggleMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, toggleMobileMenu]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle link click (close mobile menu)
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <nav 
        className="navbar" 
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        {/* Logo Section */}
        <div className="nav-left">
          {isLandingPage ? (
            <span className="logo" aria-label="Savorly Logo">
              <img src={logo} alt="" className="logo-icon" aria-hidden="true" />
              <span className="logo-text visually-hidden">Savorly</span>
            </span>
          ) : (
            <Link 
              to="/home" 
              className="logo" 
              onClick={handleLinkClick}
              aria-label="Go to home page"
            >
              <img src={logo} alt="" className="logo-icon" aria-hidden="true" />
              <span className="logo-text visually-hidden">Savorly</span>
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        {!isLandingPage && (
          <div 
            className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}
            role="menu"
            aria-label="Main menu"
            aria-hidden={!isMobileMenuOpen && window.innerWidth <= 768}
          >
            <Link 
              to="/create-recipe" 
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="Create a new recipe"
            >
              Create Recipe
            </Link>
            
            <Link 
              to="/saved-recipes" 
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="View your saved recipes"
            >
              Saved Recipes
            </Link>
            
            <Link 
              to="/about" 
              onClick={handleLinkClick}
              role="menuitem"
              aria-label="Learn about us"
            >
              About Us
            </Link>
            
            {/* Admin Link - Only for admin users */}
            {user?.role === 'admin' && 
              location.pathname !== '/admin-dashboard' && 
              !location.pathname.startsWith('/admin') && (
                <Link 
                  to="/admin-dashboard" 
                  onClick={handleLinkClick}
                  role="menuitem"
                  aria-label="Go to admin dashboard"
                >
                  Admin
                </Link>
            )}

            {/* Logout Button - Mobile Only */}
            {userProfile && (
              <button
                onClick={handleLogout}
                className="logout-btn"
                role="menuitem"
                aria-label="Log out of your account"
                type="button"
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* Right Section - Avatar (Only show on authenticated pages) */}
        {!isLandingPage && (
          <div className="navbar-right">
            {!isLoading && userProfile ? (
              <div className="user-info">
                <Link 
                  to="/profile" 
                  onClick={handleLinkClick}
                  aria-label={`View profile for ${userProfile.username || 'user'}`}
                >
                  <img
                    src={userProfile.avatar_url || defaultAvatar}
                    alt={`${userProfile.username || 'User'}'s avatar`}
                    className="user-avatar"
                    loading="lazy"
                  />
                </Link>
              </div>
            ) : !isLoading ? (
              <Link 
                to="/profile" 
                onClick={handleLinkClick}
                aria-label="View your profile"
              >
                <img 
                  src={defaultAvatar} 
                  alt="Default user avatar" 
                  className="user-avatar"
                  loading="lazy"
                />
              </Link>
            ) : null}
          </div>
        )}

        {/* Hamburger Menu Button - Mobile Only */}
        {!isLandingPage && (
          <button
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;