import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "font-awesome/css/font-awesome.min.css";
import savorlyLogo from "../assets/images/logo.png"; 
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from "../utils/validation";  // Imported from utils/validation.js
import { loginUser } from "../services/auth";  // Imported from services/auth.js

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    setError("");
  
    // Validate email and password using the imported functions
    if (!validateEmail(email)) return setError("Invalid email format");
    console.log("validateEmail:", validateEmail(email));

    if (!validatePassword(password)) return setError("Password must be at least 8 characters long and contain a letter, a number, and a special character");
  
    console.log("Sending Login Request:", { email, password });
  
    try {
      const user = await loginUser({ email, password });  // Call the loginUser function from services/auth.js
  
      console.log("Login successful. User:", user);
      setUser(user);
      if (user.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again later.";
      setError(errorMsg);
      console.log("Error state:", errorMsg);

    }
    
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form-wrapper">
        <img src={savorlyLogo} alt="Savorly Logo" className="login-logo"  />
        <p className="subtitle">Log in to explore delicious recipes!</p>

        <form onSubmit={handleSubmit} className="login-form">
        {error && (
  <p className="error-message">
    <i className="fa fa-exclamation-circle error-icon" aria-hidden="true"></i>
    {error}
  </p>
)}

          <div className="form-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}
              onClick={() => setPasswordVisible(!passwordVisible)}
            ></i>
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
