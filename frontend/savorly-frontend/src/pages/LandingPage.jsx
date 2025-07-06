import React from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faPen, faStar, faUserPlus, faBook, faShare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover and Share Amazing Recipes</h1>
          <p className="hero-subtitle">
            Explore thousands of recipes, share your own, and join the Savorly community!
          </p>
          <div className="cta-buttons">
            <Link to="/register">
              <button className="cta-btn">Get Started</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">What Makes Savorly Special?</h2>
        <div className="feature-list">
          {[
            { icon: faUtensils, title: "Browse Recipes", text: "Find your next favorite dish from thousands of recipes." },
            { icon: faPen, title: "Create Recipes", text: "Share your cooking creations with others." },
            { icon: faStar, title: "Rate Recipes", text: "Help others by rating and reviewing recipes." }
          ].map((feature, index) => (
            <article key={index} className="feature">
              <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          {[
            { icon: faUserPlus, step: "1. Sign Up", text: "Create your free account to get started." },
            { icon: faBook, step: "2. Browse & Save", text: "Explore recipes and save your favorites." },
            { icon: faShare, step: "3. Share Recipes", text: "Post your culinary creations for others to enjoy." }
          ].map((step, index) => (
            <article key={index} className="step">
              <FontAwesomeIcon icon={step.icon} className="step-icon" />
              <h3>{step.step}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
