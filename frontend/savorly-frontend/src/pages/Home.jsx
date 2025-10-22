import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import RecipeCard from "../components/RecipeCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Toast from "../components/Toast";
import { useAuth } from "../contexts/AuthContext";
import fetchData from "../utils/fetchData";
import HowToTips from "../components/HowToTips";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [recipesError, setRecipesError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
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

      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="home-page">
        <header className="hero" role="banner">
          <h1>Welcome to Savorly</h1>
          {user && (
            <p className="user-greeting">
              👋 <span className="username">{user.first_name}</span>, ready to discover amazing recipes? 🍽️
            </p>
          )}
          <Link to="/create-recipe" className="cta-link" aria-label="Create a new recipe">
            <button className="cta-btn">Create a Recipe</button>
          </Link>
        </header>

        <main id="main-content">
          <section className="categories" aria-labelledby="categories-heading">
            <h2 id="categories-heading">Explore Categories</h2>
            {categoriesError ? (
              <div className="error-card">
                <p>{categoriesError}</p>
                <button className="retry-btn" onClick={retryFetch} aria-label="Retry loading categories">🔁 Retry</button>
              </div>
            ) : (
              <div className="category-list">
                {categories.length ? (
                  categories.map((c) => (
                    <Link key={c.id} to={`/categories/${c.id}`} className="category-card" aria-label={`Go to category: ${c.name}`}>
                      <div className="category-name">{c.name}</div>
                    </Link>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </div>
            )}
          </section>

          <section className="recipe-list" aria-labelledby="recipes-heading">
            <h2 id="recipes-heading">Featured Recipes</h2>
            {recipesError ? (
              <div className="error-card">
                <p>{recipesError}</p>
                <button className="retry-btn" onClick={retryFetch} aria-label="Retry loading recipes">🔁 Retry</button>
              </div>
            ) : (
              <div className="scroll-container">
                <button
                  className="scroll-button left"
                  onClick={() => scrollRecipes("left")}
                  aria-label="Scroll recipes left"
                >
                  {"<"}
                </button>
                <div className="recipes" ref={recipeListRef}>
                  {recipes.length ? (
                    recipes
                      .slice()
                      .reverse()
                      .map((r) => (
                        <RecipeCard
                          key={r.id}
                          recipe={r}
                          onDelete={() => {
                            setRecipes(prev => prev.filter(recipe => recipe.id !== r.id));
                            setToastMessage("Recipe deleted successfully.");
                          }}
                        />
                      ))
                  ) : (
                    <p>No recipes available</p>
                  )}
                </div>
                <button
                  className="scroll-button right"
                  onClick={() => scrollRecipes("right")}
                  aria-label="Scroll recipes right"
                >
                  {">"}
                </button>
              </div>
            )}
          </section>

          <section className="tips-section" aria-labelledby="tips-heading">
            <h2 id="tips-heading">How-To Tips</h2>
            <HowToTips />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
