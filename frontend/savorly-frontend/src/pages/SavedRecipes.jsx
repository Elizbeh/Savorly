import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this is the correct import path
import Cookies from 'js-cookie';
import './SavedRecipes.css';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const authToken = Cookies.get('authToken');

  // Fetch saved recipes for the user
  const fetchSavedRecipes = async () => {
    if (!authToken) {
      setMessage({ type: 'error', text: 'You must be logged in to view saved recipes.' });
      return;
    }

    try {
      const response = await api.get('/api/saved-recipes', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSavedRecipes(response.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setMessage({ type: 'error', text: 'Failed to load saved recipes. Please try again.' });
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  return (
    <div className="saved-recipes-container">
      <h2>Saved Recipes</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      {savedRecipes.length > 0 ? (
        <div className="recipes-grid">
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={recipe.image_url || '/default_recipe_image.png'}
                alt={recipe.title}
                className="recipe-image"
              />
              <h3>{recipe.title}</h3>
              <p>{recipe.description || 'No description available.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved recipes found.</p>
      )}
    </div>
  );
};

export default SavedRecipes;
