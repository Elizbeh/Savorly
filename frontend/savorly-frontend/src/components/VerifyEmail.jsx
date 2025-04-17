import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  console.log("Extracted Token:", token);

  useEffect(() => {
    if (!token) {
      setError("Token is missing.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/verify-email?token=${token}`, {
          method: "GET",
          credentials: "include",
        });

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
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/auth/resend-verification", {
        method: "POST",
        credentials: "include", // ✅ Cookies for session-based email lookup
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setError("");
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
