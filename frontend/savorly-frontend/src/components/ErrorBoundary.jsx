import React from "react";
import PropTypes from "prop-types";
import "./ErrorBoundary.css";

/**
 * Production-ready Error Boundary
 *
 * Features:
 * - Catches rendering errors in children
 * - Optional custom fallback UI
 * - Reset functionality
 * - Clean logging
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    const { onError } = this.props;

    // Log to console (development)
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Optional external logger (Sentry, etc.)
    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      // Custom fallback support
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-card">
            <h1>Something went wrong.</h1>
            <p>
              {error?.message || "An unexpected error occurred."}
            </p>
            <button onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,

  // Optional custom fallback renderer
  fallback: PropTypes.func,

  // Optional reset handler
  onReset: PropTypes.func,

  // Optional external error logger
  onError: PropTypes.func,
};

export default ErrorBoundary;
