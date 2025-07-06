import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import './RecipeList.css';
import api from '../services/api'; // your axios instance

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]); // list of categories
  const [selectedCategory, setSelectedCategory] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Fetch all categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.get('/api/categories'); // Adjust if your endpoint differs
        setCategories(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories, please try again later.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch recipes filtered by selectedCategory
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
        setErrorMessage('Failed to load recipes, please try again later.');
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  // Delete recipe handler
  const handleDelete = async (recipeId) => {
    try {
      await api.delete(`/api/recipes/${recipeId}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setErrorMessage('Failed to delete recipe, please try again later.');
    }
  };

  // Find category name from ID for displaying in no results message
  const selectedCategoryName = categories.find(cat => cat.id === Number(selectedCategory))?.name;

  return (
    <div className="recipe-list-container">
      <h1 className="recipe-list-title">Discover Delicious Recipes</h1>

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="category-select">Filter by category: </label>
        {loadingCategories ? (
          <div className="spinner">Loading categories...</div>
        ) : (
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Recipes Grid */}
      <div className="recipe-grid">
        {loadingRecipes ? (
          <div className="spinner">Loading recipes...</div>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
          ))
        ) : (
          <p>
            No recipes found
            {selectedCategory ? ` for "${selectedCategoryName || selectedCategory}"` : ''}.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
