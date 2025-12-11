import React from 'react';
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <div className="app-wrapper">
          <main className="error-boundary-container">
            <h1>Something went wrong.</h1>
            <p>{error?.message || 'An unexpected error occurred.'}</p>
            <button onClick={this.handleReload}>Reload</button>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
