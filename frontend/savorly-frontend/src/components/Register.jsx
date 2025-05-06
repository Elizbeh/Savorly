import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../assets/images/logo.png";
import registerImage from "../assets/images/pic01.png";
import { validateEmail, validatePassword } from "../utils/validation";
import api from "../services/api"; // ✅ Using custom Axios instance

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validate = () => {
      let formErrors = {};
      
      // Use utility functions for validation
      if (!formData.first_name) formErrors.first_name = "First Name is required";
      if (!formData.last_name) formErrors.last_name = "Last Name is required";
      if (!formData.email) formErrors.email = "Email is required";
      else if (!validateEmail(formData.email)) formErrors.email = "Invalid email format";
      if (!formData.password) formErrors.password = "Password is required";
      else if (!validatePassword(formData.password)) formErrors.password = "Password should be at least 8 characters and include a letter, number, and special character";
      
      return formErrors;
    };
  
    const errors = validate();
    
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
  
    try {
      setIsLoading(true);
      setError("");
      setMessage(""); // Reset success message
  
      // ✅ Sending registration request via Axios
      const { data } = await api.post("/api/auth/register", formData);
  
      setMessage(data.message || "Registration successful! Please check your email for verification.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error submitting form. Please try again.";
      setError(errorMsg); // Set the error message here
      console.log(errorMsg); // Log the error message
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="register-container">
      <div className="register-image-section">
        <img src={registerImage} alt="Join Savorly" />
      </div>

      <div className="register-form-section">
        <div className="brand">
          <img src={logo} alt="Savorly Logo" className="logo" />
        </div>
        <p className="register-subtext">Join Savorly and explore amazing recipes!</p>

        {error && (
  <div className="feedback-message error-message" role="alert">
    <span className="feedback-icon">❌</span>
    {typeof error === "string" ? (
      <div>{error}</div>
    ) : (
      Object.entries(error).map(([field, msg], idx) => (
        <div key={idx}>{msg}</div>
      ))
    )}
  </div>
)}

        {message && (
          <div className="feedback-message success-message" role="alert">
            <span className="feedback-icon">✅</span>
            {message}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="terms-text">
          By signing up, you agree to our <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
