import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const token = decodeURIComponent(queryParams.get("token"));
  console.log("Token extracted from URL:", token);

  useEffect(() => {
    if (!token) {
      setError("Token is missing.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setMessage(data.message);
          setTimeout(() => {
            navigate(data.redirectUrl || "/login"); 
          }, 2000);
        } else {
          setError(data.message);
          if (data.message.includes("expired")) {
            setShowResend(true);
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setError("There was an error verifying your email.");
      }
    };
    

    verifyToken();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    const email = ""; // Ideally, email should be fetched securely, maybe via session or token-based auth.
    if (!email) {
      setError("Email not found. Please log in again.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div>
          <p className="error">{error}</p>
          {showResend && (
            <button onClick={handleResendVerification} disabled={resendLoading}>
              {resendLoading ? "Resending..." : "Resend Verification Email"}
            </button>
          )}
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
