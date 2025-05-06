import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import RecipeCard from "../components/RecipeCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext"; // ✅ use auth context
import fetchData from "../utils/fetchData";
import handleDelete from "../utils/handleDelete";
import handleSaveToggle from "../utils/handleSaveToggle";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [recipesError, setRecipesError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const recipeListRef = useRef(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData(setRecipes, setCategories, setRecipesError, setCategoriesError, setToastMessage);
  }, [user, navigate]);

  const retryFetch = () => {
    setToastMessage("Retrying to load data...");
    setTimeout(() => fetchData(setRecipes, setCategories, setRecipesError, setCategoriesError, setToastMessage), 1000);
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
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      <div className="home-page">
        <div className="hero">
          <h1>Welcome to Savorly</h1>
          {user && (
            <p className="user-greeting">
              👋 <span className="username">{user.first_name}</span>, ready to discover amazing recipes? 🍽️
            </p>
          )}
          <Link to="/create-recipe">
            <button className="cta-btn">Create a Recipe</button>
          </Link>
        </div>

        <section className="categories">
          <h2>Explore Categories</h2>
          {categoriesError ? (
            <div className="error-card">
              <p>{categoriesError}</p>
              <button className="retry-btn" onClick={retryFetch}>🔁 Retry</button>
            </div>
          ) : (
            <div className="category-list">
              {categories.length ? (
                categories.map((c) => (
                  <Link key={c.id} to={`/categories/${c.id}`} className="category-card">
                    <div className="category-name">{c.name}</div>
                  </Link>
                ))
              ) : (
                <p>No categories available</p>
              )}
            </div>
          )}
        </section>

        <section className="recipe-list">
          <h2>Featured Recipes</h2>
          {recipesError ? (
            <div className="error-card">
              <p>{recipesError}</p>
              <button className="retry-btn" onClick={retryFetch}>🔁 Retry</button>
            </div>
          ) : (
            <div className="scroll-container">
              <button className="scroll-button left" onClick={() => scrollRecipes("left")}>
                {"<"}
              </button>
              <div className="recipes" ref={recipeListRef}>
                {recipes.length ? (
                  recipes
                    .slice()
                    .reverse()
                    .map((r) => (
                      <RecipeCard key={r.id} recipe={r} onDelete={(id) => handleDelete(id, user, setRecipes, setToastMessage)} onSave={(recipe, isSaved) => handleSaveToggle(recipe, isSaved, setSavedRecipes, setToastMessage)} />
                    ))
                ) : (
                  <p>No recipes available</p>
                )}
              </div>
              <button className="scroll-button right" onClick={() => scrollRecipes("right")}>
                {">"}
              </button>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
