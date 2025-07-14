import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./VerifyEmail.css"; // Add styles for animation and layout

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  /*const params = new URLSearchParams(window.location.search);
  const token = params.get("token");*/
  
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const token = hashParams.get("token");


  useEffect(() => {
     console.log("Token from URL:", token)
    if (!token) {
      setError("Verification token is missing.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await api.get(`/api/auth/verify-email?token=${token}`);

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
      } catch (err) {
        console.error("Error verifying email:", err);
        setError("There was an error verifying your email.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const { data } = await api.post("/api/auth/resend-verification");

      if (data.success) {
        setMessage(data.message);
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <p>Verifying your email...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-text">{error}</p>
          {showResend && (
            <button onClick={handleResendVerification} disabled={resendLoading} className="resend-button">
              {resendLoading ? (
                <>
                  <span className="small-spinner" /> Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="success-text">{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
