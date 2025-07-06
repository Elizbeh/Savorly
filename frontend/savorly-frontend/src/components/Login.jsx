import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "font-awesome/css/font-awesome.min.css";
import savorlyLogo from "../assets/images/logo.png";
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from "../utils/validation";
import { loginUser } from "../services/auth";

const Login = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // local state for triggering navigation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Invalid email format");
    }
    if (!validatePassword(password)) {
      return setError("Password must be at least 8 characters long and contain a letter, a number, and a special character");
    }

    try {
      const userData = await loginUser({ email, password });
      console.log("Login success:", userData);

      setUser(userData);   
      console.log("User role:", user.role);
console.log("Navigating...");
        // updates global AuthContext
      setLoggedInUser(userData);   // triggers navigation in useEffect
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again later.";
      console.error("Login error:", err);
      setError(errorMsg);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.role === 'admin') {
        console.log("Navigating to admin-dashboard...");
        navigate("/admin-dashboard");
      } else {
        console.log("Navigating to home...");
        navigate("/home");
      }
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form-wrapper">
        <img src={savorlyLogo} alt="Savorly Logo" className="login-logo" />
        <p className="subtitle">Log in to explore delicious recipes!</p>

        {error && (
          <p className="error-message">
            <i className="fa fa-exclamation-circle error-icon" aria-hidden="true"></i>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="login-form">
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
