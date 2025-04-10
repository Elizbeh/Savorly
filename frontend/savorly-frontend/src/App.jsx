import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import CategoryPage from './pages/CategoryPage';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import HomePage from './pages/Home';
import RecipeForm from './pages/RecipeFormPage';
import ProfilePage from './pages/Profile';
import SavedRecipes from './pages/SavedRecipes';
import VerifyEmail from "./components/verifyEmail";
import './App.css';

// ProtectedRoute component to guard routes based on authentication status
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};


function App() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Fetch user profile if authToken exists in cookies
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user profile");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        {!["/login", "/register", "/verify-email"].includes(location.pathname) && (
          <Navbar user={user} isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        )}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/create-recipe" element={<RecipeForm />} />
          <Route path="/recipe-form/:id" element={<RecipeForm />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          {/* Pass setUser to ProfilePage to update user data globally */}
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
