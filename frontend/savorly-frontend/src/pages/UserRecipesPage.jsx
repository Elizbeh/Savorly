import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import fetchUserRecipes from '../utils/fetchUserRecipes';
import RecipeCard from '../components/RecipeCard';
import './UserRecipesPage.css';

const SkeletonCard = () => (
  <div className="my-recipes-skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line--short" />
    </div>
  </div>
);

const UserRecipesPage = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserRecipes(setUserRecipes, setError, console.log).finally(() =>
        setLoading(false)
      );
    }
  }, [user]);

  return (
    <div className="my-recipes-page">
      {/* Header */}
      <header className="my-recipes-header">
        <div className="my-recipes-header__inner">
          <div className="my-recipes-header__text">
            <span className="my-recipes-header__label">Your Cookbook</span>
            <h1 className="my-recipes-header__title">My Recipes</h1>
            {!loading && !error && (
              <p className="my-recipes-header__meta">
                <span>{userRecipes.length}</span>{' '}
                {userRecipes.length === 1 ? 'recipe' : 'recipes'} created
              </p>
            )}
          </div>
          <Link to="/create-recipe" className="my-recipes-header__action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            New Recipe
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="my-recipes-body">

        {/* Error */}
        {error && (
          <div className="my-recipes-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="my-recipes-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && userRecipes.length === 0 && (
          <div className="my-recipes-empty">
            <div className="my-recipes-empty__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <path d="M9 12h6m-6 4h4"/>
              </svg>
            </div>
            <h2 className="my-recipes-empty__title">No recipes yet</h2>
            <p className="my-recipes-empty__subtitle">
              Your cookbook is empty — start building it by creating your first recipe.
            </p>
            <Link to="/create-recipe" className="my-recipes-empty__cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
              Create Your First Recipe
            </Link>
          </div>
        )}

        {/* Recipes grid */}
        {!loading && !error && userRecipes.length > 0 && (
          <div className="my-recipes-grid">
            {userRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={() => setUserRecipes((prev) => prev.filter((r) => r.id !== recipe.id))}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserRecipesPage;