import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"; // Custom styling for the page

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Handle registration logic here (e.g., API request)
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h1>Create Your Account</h1>
        <p>Join Savorly and savor the best recipes!</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">
            Sign Up
          </button>
        </form>
        <p className="terms-text">
          By clicking on the <strong>Sign-Up</strong> button, you agree to our{" "}
          <Link to="/terms">Terms and Conditions</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
