import React from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AboutPage from './pages/AboutPage';
import './App.css';

// ✅ ProtectedRoute using useAuth
const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth(); // ✅ use context for Navbar access
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      {!["/login", "/register", "/verify-email"].includes(location.pathname) && (
        <Navbar user={user} isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />
        <Route path="/create-recipe" element={<ProtectedRoute element={<RecipeForm />} />} />
        <Route path="/recipe-form/:id" element={<ProtectedRoute element={<RecipeForm />} />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/saved-recipes" element={<ProtectedRoute element={<SavedRecipes />} />} />
      </Routes>
    </ErrorBoundary>
  );
};

// ✅ Wrap entire App in AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
