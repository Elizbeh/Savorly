import React, { useEffect, useRef } from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faPen, 
  faStar, 
  faUserPlus, 
  faBook, 
  faShare 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const heroRef = useRef(null);

  // Add intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Observe all feature and step cards with correct class names
      const cards = document.querySelectorAll('.feature-card, .step-card');
      cards.forEach(card => observer.observe(card));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Features data
  const features = [
    { 
      icon: faUtensils, 
      title: "Browse Recipes", 
      description: "Find your next favorite dish from thousands of recipes curated by our community.",
      ariaLabel: "Browse thousands of recipes"
    },
    { 
      icon: faPen, 
      title: "Create Recipes", 
      description: "Share your cooking creations and inspire others with your unique dishes.",
      ariaLabel: "Create and share your recipes"
    },
    { 
      icon: faStar, 
      title: "Rate Recipes", 
      description: "Help others discover great recipes by rating and reviewing dishes you've tried.",
      ariaLabel: "Rate and review recipes"
    }
  ];

  // How it works steps
  const steps = [
    { 
      icon: faUserPlus, 
      step: "Sign Up", 
      stepNumber: 1,
      description: "Create your free account in seconds and join our growing community.",
      ariaLabel: "Step 1: Sign up for free"
    },
    { 
      icon: faBook, 
      step: "Browse & Save", 
      stepNumber: 2,
      description: "Explore thousands of recipes and save your favorites for later.",
      ariaLabel: "Step 2: Browse and save recipes"
    },
    { 
      icon: faShare, 
      step: "Share Recipes", 
      stepNumber: 3,
      description: "Post your culinary creations for others to enjoy and try.",
      ariaLabel: "Step 3: Share your recipes"
    }
  ];

  return (
    <main className="landing-page" id="main-content">
      {/* Hero Section */}
      <section 
        className="hero" 
        ref={heroRef}
        aria-labelledby="hero-title"
      >
        <div className="hero-overlay" aria-hidden="true"></div>
        
        <div className="hero-content">
          <h1 id="hero-title" className="hero-title">
            Discover and Share Amazing Recipes
          </h1>
          
          <p className="hero-subtitle">
            Explore thousands of recipes, share your own, and join the Savorly community!
          </p>
          
          <div className="cta-buttons">
            <Link 
              to="/register" 
              className="cta-btn primary"
              aria-label="Get started with Savorly - Create your free account"
            >
              Get Started
              
            </Link>
            
            <Link 
              to="/login" 
              className="cta-btn secondary"
              aria-label="Log in to your existing Savorly account"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <span className="scroll-arrow"></span>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="features" 
        aria-labelledby="features-title"
      >
        <div className="section-container">
          <h2 id="features-title" className="section-title">
            What Makes Savorly Special?
          </h2>
          
          <p className="section-description">
            Join thousands of food lovers who trust Savorly for their recipe needs
          </p>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <article 
                key={index} 
                className="feature-card"
                aria-labelledby={`feature-${index}-title`}
              >
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <FontAwesomeIcon 
                    icon={feature.icon} 
                    className="feature-icon"
                  />
                </div>
                
                <h3 
                  id={`feature-${index}-title`}
                  className="feature-title"
                >
                  {feature.title}
                </h3>
                
                <p className="feature-description">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        className="how-it-works" 
        aria-labelledby="how-it-works-title"
      >
        <div className="section-container">
          <h2 id="how-it-works-title" className="section-title">
            How It Works
          </h2>
          
          <p className="section-description">
            Getting started with Savorly is easy and takes just minutes
          </p>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article 
                key={index} 
                className="step-card"
                aria-labelledby={`step-${index}-title`}
              >
                <div className="step-number" aria-hidden="true">
                  {step.stepNumber}
                </div>
                
                <div className="step-icon-wrapper" aria-hidden="true">
                  <FontAwesomeIcon 
                    icon={step.icon} 
                    className="step-icon"
                  />
                </div>
                
                <h3 
                  id={`step-${index}-title`}
                  className="step-title"
                >
                  {step.step}
                </h3>
                
                <p className="step-description">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          {/* Final CTA */}
          <div className="final-cta">
            <h3 className="final-cta-title">
              Ready to Start Your Culinary Journey?
            </h3>
            <Link 
              to="/register" 
              className="cta-btn primary large"
              aria-label="Join Savorly now and create your free account"
            >
              Join Savorly Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;