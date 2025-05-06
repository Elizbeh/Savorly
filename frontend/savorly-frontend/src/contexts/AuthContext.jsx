// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Import the configured Axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/auth/user");
      setUser(data);
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      // Clear the authentication token from cookies
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
