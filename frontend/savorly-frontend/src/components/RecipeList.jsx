import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import './RecipeList.css';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setErrorMessage('Failed to load recipes, please try again later.');
      }
    };

    fetchRecipes();
  }, []);

  // Handle delete logic
  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5001/api/recipes/${recipeId}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setErrorMessage('Failed to delete recipe, please try again later.');
    }
  };

  return (
    <div className="recipe-list-container">
      <h1 className="recipe-list-title">Discover Delicious Recipes</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
