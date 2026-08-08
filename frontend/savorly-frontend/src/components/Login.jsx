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
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateEmail(email)) {
      setIsLoading(false);
      return setError("Please enter a valid email address.");
    }
    if (!validatePassword(password)) {
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      navigate(loggedInUser.role === "admin" ? "/admin-dashboard" : "/home");
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-brand">
        <div className="brand-content">
          <Link to="/" className="brand-logo-link">
            <img src={savorlyLogo} alt="Savorly" className="brand-logo" />
          </Link>
          <h1 className="brand-title">Welcome Back</h1>
          <p className="brand-subtitle">
            Sign in to discover and share amazing recipes with our community
          </p>
          
          {/* Decorative Elements */}
          <div className="brand-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          {/* Header */}
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm14 2l-7 5-7-5v9h14V6z" fill="currentColor"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a5 5 0 015 5v2h1a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v2h6V7a3 3 0 00-3-3z" fill="currentColor"/>
                </svg>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" fill="currentColor"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 7a3 3 0 100 6 3 3 0 000-6zM2 10s3-7 8-7 8 7 8 7-3 7-8 7-8-7-8-7z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M2 2l16 16" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="form-options">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="25"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="form-footer">
            <p>
              Don't have an account? 
              <Link to="/register" className="signup-link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}