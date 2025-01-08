import React from 'react';
import './landing-page.css';  // Optional: Add styles for this page

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Discover and Share Amazing Recipes</h1>
        <p>Explore thousands of recipes, share your own, and join the Savorly community!</p>
        <button className="cta-button">Get Started</button>
      </section>

      <section className="features">
        <div className="feature">
          <h2>Browse Recipes</h2>
          <p>Find your next favorite dish from thousands of recipes.</p>
        </div>
        <div className="feature">
          <h2>Create Recipes</h2>
          <p>Share your cooking creations with others.</p>
        </div>
        <div className="feature">
          <h2>Rate Recipes</h2>
          <p>Help others by rating and reviewing recipes.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Sign up to create an account</li>
          <li>Browse recipes and save your favorites</li>
          <li>Share your own recipes with the world</li>
        </ol>
      </section>

      <footer>
        <p>Follow us on <a href="#">Facebook</a>, <a href="#">Twitter</a>, <a href="#">Instagram</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;
