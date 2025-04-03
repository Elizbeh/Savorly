import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import RecipeCard from "../components/RecipeCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import api from "../services/api";
import Cookies from "js-cookie";



const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [recipesError, setRecipesError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const recipeListRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("authToken") || localStorage.getItem("authToken");

      console.log("Token in HomePage:", token);
      if (!token) {
        console.log("No token found, redirecting in 5 seconds...");
        setTimeout(() => navigate("/login"), 5000);
      }
      
      try {
        const response = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
  
    fetchUser();
    
  
  }, [navigate]);
  
  const fetchData = async () => {
    try {
      const [recipeResponse, categoryResponse] = await Promise.all([
        api.get("/api/recipes"),
        api.get("/api/categories"),
      ]);
      console.log("Recipes Data:", recipeResponse.data);
      console.log("Categories Data:", categoryResponse.data);
  
      setRecipes(recipeResponse.data);
      setCategories(categoryResponse.data);
      setRecipesError(null);
      setCategoriesError(null);
    } catch (error) {
      console.error("API Error:", error);
      setRecipesError("Unable to load recipes. Please try again.");
      setCategoriesError("Unable to load categories. Please try again.");
      setToastMessage("Failed to load data. Please try again later.");
    }
  };
  
  
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData();
    };
    fetchAllData();
  }, []);
  

  const retryFetch = () => {
    setToastMessage("Retrying to load data...");
    setTimeout(fetchData, 1000);
  };

  const handleDelete = async (recipeId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) return setToastMessage("Please log in to delete recipes.");

    try {
      await api.delete(`/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      setToastMessage("Recipe deleted successfully");
    } catch {
      setToastMessage("Failed to delete the recipe. Please try again later.");
    }
  };

  const scrollRecipes = (direction) => {
    const scrollAmount = recipeListRef.current.clientWidth;
    recipeListRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <ErrorBoundary>
      <Navbar user={user} isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      <div className="home-page">
        <div className="hero">
          <h1>Welcome to Savorly</h1>
          {user && <p>👋 {user.first_name}, ready to discover amazing recipes? 🍽️</p>}
          <Link to="/create-recipe"><button className="cta-btn">Create a Recipe</button></Link>
        </div>

        <section className="categories">
          <h2>Explore Categories</h2>
          {categoriesError ? (
            <div className="error">{categoriesError} <button onClick={retryFetch}>Retry</button></div>
          ) : (
            <div className="category-list">
              {categories.length ? categories.map((c) => (
                <Link key={c.id} to={`/categories/${c.id}`} className="category-card">
                  <div className="category-name">{c.name}</div>
                </Link>
              )) : <p>No categories available</p>}
            </div>
          )}
        </section>

        <section className="recipe-list">
          <h2>Featured Recipes</h2>
          {recipesError ? (
            <div className="error">{recipesError} <button onClick={retryFetch}>Retry</button></div>
          ) : (
            <div className="scroll-container">
              <button className="scroll-button left" onClick={() => scrollRecipes("left")}>{"<"}</button>
              <div className="recipes" ref={recipeListRef}>
                {recipes.length ? recipes.map((r) => (
                  <RecipeCard key={r.id} recipe={r} onDelete={handleDelete} />
                )) : <p>No recipes available</p>}
              </div>
              <button className="scroll-button right" onClick={() => scrollRecipes("right")}>{">"}</button>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
