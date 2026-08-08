import React, { useEffect } from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Intersection Observer: animate cards when they enter viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.landing-feature-card, .landing-step-card, .landing-stat-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Features Section
  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 4C18.48 4 14 8.48 14 14c0 7 10 18 10 18s10-11 10-18c0-5.52-4.48-10-10-10zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor"/>
        </svg>
      ),
      title: "Discover Recipes",
      description: "Explore thousands of recipes from cuisines around the world, curated by food lovers like you."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M38 8H10c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM24 34l-8-8h5v-8h6v8h5l-8 8z" fill="currentColor"/>
        </svg>
      ),
      title: "Save Favorites",
      description: "Bookmark your favorite recipes and organize them into custom collections for easy access."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M32 6H16c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm-8 32c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8-6H16V10h16v22z" fill="currentColor"/>
        </svg>
      ),
      title: "Share & Inspire",
      description: "Post your own recipes and inspire others with your culinary creations and cooking tips."
    }
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up for free in under 60 seconds. No credit card required.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 24c-5.33 0-16 2.67-16 8v4h32v-4c0-5.33-10.67-8-16-8z" fill="currentColor"/>
        </svg>
      )
    },
    {
      number: "02",
      title: "Explore & Save",
      description: "Browse recipes, save your favorites, and build your personal cookbook.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M32 6H8c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zM18 28l-6-6 1.41-1.41L18 25.17l8.59-8.59L28 18l-10 10z" fill="currentColor"/>
        </svg>
      )
    },
    {
      number: "03",
      title: "Share Recipes",
      description: "Upload your creations and connect with food enthusiasts worldwide.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M28 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-16 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  // Hero Stats
  const stats = [
    { value: "10K+", label: "Recipes" },
    { value: "5K+", label: "Active Users" },
    { value: "50+", label: "Cuisines" },
    { value: "4.8★", label: "Rating" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-badge"> Welcome to Savorly</span>
          <h1 className="landing-hero-title">
            Discover, Create & Share <span className="landing-gradient-text">Amazing Recipes</span>
          </h1>
          <p className="landing-hero-subtitle">Join thousands of home cooks and food enthusiasts</p>
          <div className="landing-hero-actions">
            <Link className="btn-landing primary" to="/register">Get Started</Link>
            <Link className="btn-landing secondary" to="/login">Sign In</Link>
          </div>

          {/* Hero Stats */}
          <div className="landing-hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="landing-stat-item">
                <div className="landing-stat-value">{stat.value}</div>
                <div className="landing-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">Features</span>
            <h2 className="landing-section-title">Everything You Need</h2>
            <p className="landing-section-subtitle">
              Powerful features to help you discover, save, and share your favorite recipes
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="landing-feature-card">
                <div className="landing-feature-icon">{feature.icon}</div>
                <h3 className="landing-feature-title">{feature.title}</h3>
                <p className="landing-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-steps-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">Simple Process</span>
            <h2 className="landing-section-title">How It Works</h2>
            <p className="landing-section-subtitle">Get started in three easy steps</p>
          </div>

          <div className="landing-features-grid">
            {steps.map((step, index) => (
              <div key={index} className="landing-step-card">
                <div className="landing-step-number">{step.number}</div>
                <div className="landing-step-icon">{step.icon}</div>
                <h3 className="landing-feature-title">{step.title}</h3>
                <p className="landing-feature-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <div className="landing-cta-content">
          <h2 className="landing-cta-title">Ready to Start Cooking?</h2>
          <p className="landing-cta-subtitle">
            Join our community of food lovers and start sharing your favorite recipes today
          </p>
          <Link to="/register" className="btn-landing primary">
            Create Free Account
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
