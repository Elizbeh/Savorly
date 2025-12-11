import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTwitter, 
  faFacebookF, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faHeart 
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

/**
 * Footer Component
 * 
 * Main footer for the Savorly application featuring:
 * - Navigation links to key pages
 * - Social media icons with external links
 * - Copyright information
 * - Fully accessible with ARIA labels
 * - Responsive design for all screen sizes
 */
const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Navigation links configuration
  const navigationLinks = [
    { to: '/about', label: 'About Us', ariaLabel: 'Learn more about Savorly' },
    { to: '/contact', label: 'Contact', ariaLabel: 'Get in touch with us' },
    { to: '/privacy', label: 'Privacy Policy', ariaLabel: 'Read our privacy policy' },
    { to: '/terms', label: 'Terms of Service', ariaLabel: 'Read our terms of service' }
  ];

  // Social media links configuration
  const socialLinks = [
    {
      href: 'https://twitter.com/savorly',
      icon: faTwitter,
      label: 'Twitter',
      ariaLabel: 'Visit our Twitter page (opens in new tab)'
    },
    {
      href: 'https://facebook.com/savorly',
      icon: faFacebookF,
      label: 'Facebook',
      ariaLabel: 'Visit our Facebook page (opens in new tab)'
    },
    {
      href: 'https://instagram.com/savorly',
      icon: faInstagram,
      label: 'Instagram',
      ariaLabel: 'Visit our Instagram page (opens in new tab)'
    },
    {
      href: 'https://linkedin.com/company/savorly',
      icon: faLinkedinIn,
      label: 'LinkedIn',
      ariaLabel: 'Visit our LinkedIn page (opens in new tab)'
    }
  ];

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">Savorly</h2>
          <p className="footer-tagline">
            Discover, create, and share amazing recipes with food lovers worldwide.
          </p>
        </div>

        {/* Navigation Links Section */}
        <nav className="footer-navigation" aria-label="Footer navigation">
          <h3 className="footer-section-title">Quick Links</h3>
          <ul className="footer-nav-list">
            {navigationLinks.map((link, index) => (
              <li key={index} className="footer-nav-item">
                <Link 
                  to={link.to}
                  className="footer-nav-link"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media Section */}
        <div className="footer-social">
          <h3 className="footer-section-title">Connect With Us</h3>
          <div className="social-links" role="list" aria-label="Social media links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                role="listitem"
              >
                <FontAwesomeIcon 
                  icon={social.icon} 
                  className="social-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">{social.label}</span>
              </a>
            ))}
          </div>

          {/* Newsletter Signup (Optional) */}
          <div className="footer-newsletter">
            <a 
              href="mailto:hello@savorly.com" 
              className="newsletter-link"
              aria-label="Send us an email"
            >
              <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
              <span>hello@savorly.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} Savorly. All rights reserved.
          </p>
          <p className="made-with-love">
            Made with <FontAwesomeIcon icon={faHeart} className="heart-icon" aria-hidden="true" /> 
            <span className="visually-hidden">love</span> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;