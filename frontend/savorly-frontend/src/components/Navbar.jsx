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
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLandingPage = location.pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, toggleMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <nav 
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="navbar-container">
          {/* Logo */}
          <div className="nav-brand">
            {isLandingPage ? (
              <span className="logo" aria-label="Savorly">
                <img src={logo} alt="Savorly logo" className="logo-icon" />
              </span>
            ) : (
              <Link to="/home" className="logo" onClick={handleLinkClick}>
                <img src={logo} alt="Savorly logo" className="logo-icon" />
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          {!isLandingPage && (
            <>
              <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
                <li>
                  <Link to="/create-recipe" onClick={handleLinkClick}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14m-7-7h14"/>
                    </svg>
                    Create
                  </Link>
                </li>
                <li>
                  <Link to="/saved-recipes" onClick={handleLinkClick}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    Saved
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={handleLinkClick}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4m0-4h.01"/>
                    </svg>
                    About
                  </Link>
                </li>
                {user?.role === 'admin' && !location.pathname.startsWith('/admin') && (
                  <li>
                    <Link to="/admin-dashboard" onClick={handleLinkClick} className="admin-link">
                      Admin
                    </Link>
                  </li>
                )}
              </ul>

              {/* Right Section */}
              <div className="nav-actions">
                {!isLoading && userProfile && (
                  <>
                    <Link to="/profile" className="user-avatar-link" onClick={handleLinkClick}>
                      <img
                        src={userProfile.avatar_url || defaultAvatar}
                        alt={userProfile.username}
                        className="user-avatar"
                      />
                    </Link>
                    <button onClick={handleLogout} className="logout-button" type="button">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/>
                      </svg>
                      <span className="logout-text">Logout</span>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                type="button"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;