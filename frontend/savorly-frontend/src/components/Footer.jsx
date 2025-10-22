import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer role="contentinfo">
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </nav>

      <div className="social-media" aria-label="Social media links">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Twitter page"
        >
          <i className="fab fa-twitter" aria-hidden="true"></i>
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Facebook page"
        >
          <i className="fab fa-facebook" aria-hidden="true"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Instagram page"
        >
          <i className="fab fa-instagram" aria-hidden="true"></i>
        </a>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Savorly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
