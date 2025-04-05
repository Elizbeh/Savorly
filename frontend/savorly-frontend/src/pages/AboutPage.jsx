import React from 'react';
import './AboutPage.css'; // Optional, if you want to style the page

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Us</h1>
      </header>
      <section className="about-content">
        <h2>Welcome to Savorly</h2>
        <p>
          Savorly is a platform designed for food lovers and recipe enthusiasts. Whether you’re a home cook or a professional chef, our goal is to bring people together through the joy of cooking and sharing recipes.
        </p>
        <p>
          Our mission is simple: to make it easier for everyone to discover, create, and share delicious recipes. From healthy meals to indulgent desserts, Savorly has something for everyone.
        </p>
        
        <h3>Our Features</h3>
        <ul>
          <li>Create and share your own recipes.</li>
          <li>Save your favorite recipes to revisit later.</li>
          <li>Connect with others and get inspired by their cooking styles.</li>
          <li>Access a wide range of categories, from vegan to gluten-free, and more!</li>
        </ul>

        <h3>Our Team</h3>
        <p>
          Savorly was built by a small team of passionate developers, designers, and food lovers. Our goal is to continuously improve the platform and make cooking more enjoyable for everyone. 
        </p>

        <h3>Contact Us</h3>
        <p>
          Have any questions or feedback? Feel free to reach out to us at <a href="mailto:contact@savorly.com">contact@savorly.com</a>.
        </p>
      </section>

      <footer className="about-footer">
        <p>&copy; 2025 Savorly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
