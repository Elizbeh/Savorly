import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaInstagram, FaTwitter, FaFacebookF, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* ========================= */}
      {/* MAIN FOOTER CONTENT */}
      {/* ========================= */}
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">Savorly</h2>
          <p className="footer-tagline">
            Discover, create, and share delicious recipes from around the world.
            Cooking made simple and joyful.
          </p>

          <div className="footer-newsletter">
            <a
              href="mailto:support@savorly.com"
              className="newsletter-link"
            >
              support@savorly.com
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="footer-section-title">Explore</h4>
          <ul className="footer-nav-list">
            <li>
              <Link to="/" className="footer-nav-link">Home</Link>
            </li>
            <li>
              <Link to="/recipes" className="footer-nav-link">Recipes</Link>
            </li>
            <li>
              <Link to="/favorites" className="footer-nav-link">Favorites</Link>
            </li>
            <li>
              <Link to="/about" className="footer-nav-link">About</Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="footer-section-title">Connect</h4>
          <div className="social-links">
            <a
              href="#"
              className="social-link"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="#"
              className="social-link"
              aria-label="Twitter"
            >
              <FaTwitter size={16} />
            </a>

            <a
              href="#"
              className="social-link"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* BOTTOM SECTION */}
      {/* ========================= */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {new Date().getFullYear()} Savorly. All rights reserved.
          </p>

          <p className="made-with-love">
            Made with <FaHeart className="heart-icon" /> for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
