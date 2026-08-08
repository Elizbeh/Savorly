import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../assets/images/logo.png";
import { validateEmail, validatePassword } from "../utils/validation";
import api from "../services/api";

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
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = () => {
      let formErrors = {};

      if (!formData.first_name.trim()) formErrors.first_name = "First name is required";
      if (!formData.last_name.trim()) formErrors.last_name = "Last name is required";
      if (!formData.email) formErrors.email = "Email is required";
      else if (!validateEmail(formData.email)) formErrors.email = "Invalid email format";
      if (!formData.password) formErrors.password = "Password is required";
      else if (!validatePassword(formData.password))
        formErrors.password =
          "Password must be at least 8 characters and include a letter, number, and special character";

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
      setMessage("");

      const { data } = await api.post("/api/auth/register", formData);

      setMessage(data.message || "Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error submitting form. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Side - Branding */}
      <div className="register-brand">
        <div className="brand-content">
          <Link to="/" className="brand-logo-link">
            <img src={logo} alt="Savorly" className="brand-logo" />
          </Link>
          <h1 className="brand-title">Join Savorly</h1>
          <p className="brand-subtitle">
            Create your account and start sharing your favorite recipes with thousands of home cooks
          </p>

          {/* Decorative Elements */}
          <div className="brand-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="register-form-section">
        <div className="register-form-container">
          {/* Header */}
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Get started with your free account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
                  fill="currentColor"
                />
              </svg>
              <div className="error-content">
                {typeof error === "string" ? (
                  <span>{error}</span>
                ) : (
                  Object.entries(error).map(([field, msg], idx) => (
                    <div key={idx}>{msg}</div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="success-alert" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l7.59-7.59L18 6l-9 9z"
                  fill="currentColor"
                />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {/* Name Fields Row */}
            <div className="form-row">
              {/* First Name */}
              <div className="form-field">
                <label htmlFor="first_name" className="form-label">
                  First Name
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="form-field">
                <label htmlFor="last_name" className="form-label">
                  Last Name
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm14 2l-7 5-7-5v9h14V6z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  <path
                    d="M10 2a5 5 0 015 5v2h1a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v2h6V7a3 3 0 00-3-3z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2 10s3-7 8-7 8 7 8 7-3 7-8 7-8-7-8-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path d="M2 2l16 16" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="password-hint">
                At least 8 characters with a letter, number, and special character
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="50"
                      strokeDashoffset="25"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10h12m-6-6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Terms & Login Link */}
          <div className="form-footer">
            <p className="terms-text">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="terms-link">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="terms-link">
                Privacy Policy
              </Link>
            </p>
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;