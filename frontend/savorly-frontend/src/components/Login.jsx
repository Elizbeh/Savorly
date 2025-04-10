import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "font-awesome/css/font-awesome.min.css";
import savorlyLogo from "../assets/images/logo.png"; 
import api from '../services/api';  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!validateEmail(email)) return setError("Invalid email format");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters long and contain a letter, a number, and a special character");
  
    try {
      const response = await api.post("/api/auth/login", { email, password }, { withCredentials: true });
  
      console.log("Login Response:", response.data);
  
      if (response.status === 200) {
        console.log("Navigating to /home...");
        navigate("/home");
      } else {
        setError(response.data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };
  
  
  
  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form-wrapper">
        <img src={savorlyLogo} alt="Savorly Logo" className="login-logo" />
        <h2>Savorly</h2>
        <p className="subtitle">Log in to explore delicious recipes!</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <input
              type="email"
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
