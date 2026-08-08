import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SavedRecipes.css';
import handleSaveToggle from '../utils/handleSaveToggle';

const RECIPES_PER_PAGE = 9;

const SavedRecipes = ({ savedRecipesProp, setSavedRecipesProp }) => {
  const [savedRecipes, setSavedRecipes] = useState(savedRecipesProp || []);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(!savedRecipesProp);

  useEffect(() => {
    if (!savedRecipesProp) {
      const fetchSavedRecipes = async () => {
        try {
          setLoading(true);
          const response = await api.get('/api/saved-recipes');
          setSavedRecipes(response.data);
        } catch (error) {
          console.error('Error fetching saved recipes:', error);
          if (error.response?.status === 401) {
            setMessage({ type: 'error', text: 'You must be logged in to view saved recipes.' });
          } else {
            setMessage({ type: 'error', text: 'Failed to load saved recipes. Please try again.' });
          }
        } finally {
          setLoading(false);
        }
      };
      fetchSavedRecipes();
    }
  }, [savedRecipesProp]);

  // Auto-dismiss messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleToggleSave = (recipeId, recipeTitle) => {
    const isCurrentlySaved = true;

    handleSaveToggle(
      recipeId,
      isCurrentlySaved,
      () => {
        const updated = savedRecipes.filter((r) => r.id !== recipeId);
        setSavedRecipes(updated);

        const maxPage = Math.ceil(updated.length / RECIPES_PER_PAGE) || 1;
        if (currentPage > maxPage) setCurrentPage(maxPage);

        setMessage({ type: 'success', text: `"${recipeTitle}" removed from saved recipes.` });
      },
      (error) => {
        const errorMsg =
          error.response?.data?.message || error.message || 'Failed to remove recipe. Try again.';
        if (error.response?.status === 401) {
          setMessage({ type: 'error', text: 'You must be logged in to save recipes.' });
        } else {
          setMessage({ type: 'error', text: errorMsg });
        }
      }
    );
  };

  const totalPages = Math.ceil(savedRecipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const currentRecipes = savedRecipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="saved-recipes-page">
        <div className="saved-recipes-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your saved recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-recipes-page">
      <div className="saved-recipes-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>My Saved Recipes</h1>
            <p>Your personal collection of favorite recipes</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              <span>{savedRecipes.length} {savedRecipes.length === 1 ? 'Recipe' : 'Recipes'}</span>
            </div>
          </div>
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {message.type === 'success' ? (
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l7.59-7.59L18 6l-9 9z" fill="currentColor"/>
              ) : (
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
              )}
            </svg>
            <span>{message.text}</span>
          </div>
        )}

        {/* Recipes Grid */}
        {currentRecipes.length > 0 ? (
          <>
            <div className="recipes-grid">
              {currentRecipes.map((recipe) => (
                <article key={recipe.id} className="recipe-card">
                  <Link to={`/recipe/${recipe.id}`} className="recipe-image-link">
                    <img
                      src={recipe.image_url || '/default_recipe_image.png'}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                    <div className="recipe-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                      </svg>
                      <span>View Recipe</span>
                    </div>
                  </Link>

                  <div className="recipe-content">
                    <Link to={`/recipe/${recipe.id}`} className="recipe-title-link">
                      <h3 className="recipe-title">{recipe.title}</h3>
                    </Link>

                    <p className="recipe-description">
                      {recipe.description || 'No description available.'}
                    </p>

                    {/* Meta Info */}
                    <div className="recipe-meta">
                      {recipe.cook_time && (
                        <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>{recipe.cook_time} min</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                          </svg>
                          <span>{recipe.servings} servings</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="recipe-actions">
                      <button
                        className="btn-unsave"
                        onClick={() => handleToggleSave(recipe.id, recipe.title)}
                        title="Remove from saved"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 17.35l-1.21-1.1C4.4 12.36 2 10.28 2 7.5 2 5.42 3.42 4 5.5 4c1.16 0 2.27.51 3 1.32C9.23 4.51 10.34 4 11.5 4c2.08 0 3.5 1.42 3.5 3.5 0 2.78-2.4 4.86-6.79 8.75L10 17.35z" fill="currentColor"/>
                        </svg>
                        <span>Remove</span>
                      </button>

                      <Link to={`/recipe/${recipe.id}`} className="btn-view">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 3.75C5.83 3.75 2.27 6.34 1 10c1.27 3.66 4.83 6.25 9 6.25s7.73-2.59 9-6.25c-1.27-3.66-4.83-6.25-9-6.25zm0 10.42c-2.3 0-4.17-1.87-4.17-4.17S7.7 5.83 10 5.83s4.17 1.87 4.17 4.17-1.87 4.17-4.17 4.17zm0-6.67c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor"/>
                        </svg>
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M40 73.35l-4.83-4.39C19.33 54.48 10 46.13 10 36.25c0-8.08 5.83-13.75 13.75-13.75 4.35 0 8.52 2.03 11.25 5.23 2.73-3.2 6.9-5.23 11.25-5.23 7.92 0 13.75 5.67 13.75 13.75 0 9.88-9.33 18.23-23.17 32.75L40 73.35z" fill="currentColor"/>
            </svg>
            <h3>No Saved Recipes Yet</h3>
            <p>Start saving your favorite recipes to see them here</p>
            <Link to="/home" className="btn-browse">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v10h5v-6h4v6h5V7l-7-5z" fill="currentColor"/>
              </svg>
              Browse Recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;  