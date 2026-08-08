import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import './RecipeList.css';
import api from '../services/api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories. Please try again later.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const categoryIdNum = selectedCategory ? Number(selectedCategory) : null;
        const url = categoryIdNum
          ? `/api/recipes?categoryId=${categoryIdNum}`
          : '/api/recipes';

        const response = await api.get(url);
        setRecipes(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setErrorMessage('Failed to load recipes. Please try again later.');
      } finally {
        setLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, [selectedCategory]);

  // Auto-dismiss error
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleDelete = async (recipeId) => {
    try {
      await api.delete(`/api/recipes/${recipeId}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setErrorMessage('Failed to delete recipe. Please try again.');
    }
  };

  const selectedCategoryName = categories.find(cat => cat.id === Number(selectedCategory))?.name;

  return (
    <div className="recipe-list-page">
      <div className="recipe-list-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>All Recipes</h1>
            <p>Explore our collection of delicious recipes from around the world</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" fill="currentColor"/>
              </svg>
              <span>{recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'}</span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 4h14M3 10h10M3 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Filter by Category</span>
          </div>

          {loadingCategories ? (
            <div className="filter-loading">
              <div className="mini-spinner"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <div className="category-filters">
              <button
                className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l-5.5 9h11L10 2zm0 3.84L11.93 9h-3.87L10 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" fill="currentColor"/>
                </svg>
                All
                <span className="filter-count">{recipes.length}</span>
              </button>
              
              {categories.map((cat) => {
                const count = recipes.filter(r => r.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`category-filter-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(String(cat.id))}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert alert-error" role="alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Recipes Grid */}
        {loadingRecipes ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M40 13.33c-14.67 0-26.67 12-26.67 26.67s12 26.67 26.67 26.67 26.67-12 26.67-26.67-12-26.67-26.67-26.67zm0 48c-11.73 0-21.33-9.6-21.33-21.33S28.27 18.67 40 18.67 61.33 28.27 61.33 40 51.73 61.33 40 61.33zm-2.67-32h5.34v16h-5.34v-16zm0 21.34h5.34V56h-5.34v-5.33z" fill="currentColor"/>
            </svg>
            <h3>No Recipes Found</h3>
            <p>
              {selectedCategory 
                ? `No recipes available in "${selectedCategoryName || 'this category'}". Try selecting a different category.`
                : 'No recipes available at the moment. Check back later!'}
            </p>
            {selectedCategory && (
              <button 
                className="btn-reset-filter"
                onClick={() => setSelectedCategory('')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l-5.5 9h11L10 2z" fill="currentColor"/>
                </svg>
                View All Recipes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;