// Login.jsx (React Component)
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import savorlyLogo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail, validatePassword } from "../utils/validation";
import { loginUser } from "../services/auth";
import "./Login.css";

export default function Login() {
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }
    if (!validatePassword(password)) {
      return setError(
        "Password must be at least 8 characters long and include a letter, a number, and a special character."
      );
    }

    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      setLoggedInUser(userData);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      navigate(loggedInUser.role === "admin" ? "/admin-dashboard" : "/home");
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="login-container">
      <div className="login-image" aria-hidden="true"></div>

      <div className="login-form-wrapper">
        <Link to="/"><img src={savorlyLogo} alt="Savorly logo" className="login-logo" /></Link>
        <p className="subtitle">Log in to explore delicious recipes!</p>

        {error && (
          <p className="error-message" role="alert">
            <i className="fa fa-exclamation-circle"></i>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
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
}
