import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import RecipeCard from "../components/RecipeCard";
import fetchUserRecipes from "../utils/fetchUserRecipes";
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

  const [userRecipeError, setUserRecipeError] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);

  const [categoriesError, setCategoriesError] = useState(null);
  const recipeListRef = useRef(null);
  const myRecipesListRef = useRef(null);

  const { user } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
  const fetchAllData = async () => {
    if (!user) return;

    await Promise.all([
      fetchData(setRecipes, setCategories, setRecipesError, setCategoriesError, setToastMessage),
      fetchUserRecipes(setUserRecipes, setUserRecipeError, setToastMessage), // ← add this
    ]);
  };

  fetchAllData();
}, [user]);

  const retryFetch = () => {
    setToastMessage("Retrying to load data...");
    setTimeout(() => fetchData(setRecipes, setCategories, setRecipesError, setCategoriesError, setToastMessage), 1000);
  };

  const scrollRecipes = (ref, direction) => {
    ref.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const myRecipes = recipes.filter((r) => r.author === user?.id || r.author_id === user?.id);

  const RecipeScrollRow = ({ listRef, items, emptyState }) => (
    <div className="home-recipes-container">
      <button
        className="home-scroll-btn home-scroll-left"
        onClick={() => scrollRecipes(listRef, "left")}
        aria-label="Scroll left"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <div className="home-recipes-scroll" ref={listRef}>
        {items.length ? (
          items
            .slice()
            .reverse()
            .map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={() => {
                  setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
                  setToastMessage("Recipe deleted successfully.");
                }}
              />
            ))
        ) : emptyState}
      </div>

      <button
        className="home-scroll-btn home-scroll-right"
        onClick={() => scrollRecipes(listRef, "right")}
        aria-label="Scroll right"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  );

  return (
    <ErrorBoundary>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}

      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="home-page">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero-overlay"></div>
          <div className="home-hero-content">
            <span className="home-hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Welcome back, {user?.first_name || "Chef"}
            </span>
            <h1 className="home-hero-title">
              Your Culinary Journey
              <br />
              <span className="home-gradient-text">Starts Here</span>
            </h1>
            <p className="home-hero-subtitle">
              Discover, create, and share delicious recipes with a passionate community of home cooks
            </p>
            <div className="home-hero-actions">
              <Link to="/create-recipe" className="home-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
                Create Recipe
              </Link>
              <Link to="/saved-recipes" className="home-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                My Saved Recipes
              </Link>
            </div>
          </div>
        </section>

        <main id="main-content">
          {/* Quick Stats Bar */}
          <section className="home-stats-bar">
            <div className="home-stats-container">
              <div className="home-stat-item">
                <div className="home-stat-icon">📚</div>
                <div className="home-stat-info">
                  <span className="home-stat-value">{recipes.length}</span>
                  <span className="home-stat-label">Recipes Shared</span>
                </div>
              </div>
              <div className="home-stat-item">
                <div className="home-stat-icon">👨‍🍳</div>
                <div className="home-stat-info">
                  <span className="home-stat-value">{categories.length}</span>
                  <span className="home-stat-label">Categories</span>
                </div>
              </div>
              <div className="home-stat-item">
                <div className="home-stat-icon">⭐</div>
                <div className="home-stat-info">
                  <span className="home-stat-value">4.8</span>
                  <span className="home-stat-label">Avg Rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="home-categories-section">
            <div className="home-section-header">
              <div className="home-section-title-group">
                <h2 className="home-section-title">Browse by Category</h2>
                <p className="home-section-subtitle">Find recipes by your favorite cuisine or cooking style</p>
              </div>
            </div>

            {categoriesError ? (
              <div className="home-error-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4m0 4h.01"/>
                </svg>
                <span>{categoriesError}</span>
                <button className="home-retry-button" onClick={retryFetch}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                  Retry
                </button>
              </div>
            ) : (
              <div className="home-categories-grid">
                {categories.length ? (
                  categories.map((category) => (
                    <Link key={category.id} to={`/categories/${category.id}`} className="home-category-card">
                      <div className="home-category-icon">🍽️</div>
                      <div className="home-category-content">
                        <h3 className="home-category-name">{category.name}</h3>
                      </div>
                      <svg className="home-category-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7l7 7-7 7"/>
                      </svg>
                    </Link>
                  ))
                ) : (
                  <div className="home-empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4m0 4h.01"/>
                    </svg>
                    <p>No categories available yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Latest Recipes Section */}
          <section className="home-recipes-section">
            <div className="home-section-header">
              <div className="home-section-title-group">
                <h2 className="home-section-title">Latest Recipes</h2>
                <p className="home-section-subtitle">Fresh from our community of home chefs</p>
              </div>
              <Link to="/recipes" className="home-view-all-link">
                View All
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {recipesError ? (
              <div className="home-error-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4m0 4h.01"/>
                </svg>
                <span>{recipesError}</span>
                <button className="home-retry-button" onClick={retryFetch}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                  Retry
                </button>
              </div>
            ) : (
              <RecipeScrollRow
                listRef={recipeListRef}
                items={recipes}
                emptyState={
                  <div className="home-empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v20m10-10H2"/>
                    </svg>
                    <p>No recipes yet. Be the first to create one!</p>
                    <Link to="/create-recipe" className="home-btn-primary-small">Create Recipe</Link>
                  </div>
                }
              />
            )}
          </section>

          {/* Your Recipes Section */}
          <section className="home-recipes-section">
            <div className="home-section-header">
              <div className="home-section-title-group">
                <h2 className="home-section-title">Your Recipes</h2>
                <p className="home-section-subtitle">Everything you've created, all in one place</p>
              </div>
              <Link to="/my-recipes" className="home-view-all-link">
                View All
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {userRecipeError && <p className="error-text">{userRecipeError}</p>}

          <RecipeScrollRow
            listRef={myRecipesListRef}
            items={userRecipes.slice(0, 5)} // latest 5 recipes
            emptyState={
              <div className="home-empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20m10-10H2"/>
                </svg>
                <p>You haven't created any recipes yet.</p>
                <Link to="/create-recipe" className="home-btn-primary-small">
                  Create Your First Recipe
                </Link>
              </div>
            }
          />
          </section>
          {/* Tips Section */}
          <HowToTips />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;