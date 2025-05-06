import React, { useState, useEffect } from 'react';
import './RecipeCard.css';
import { FaEllipsisV, FaTrashAlt, FaEdit, FaEye, FaHeart } from 'react-icons/fa';
import { deleteRecipe } from '../services/recipeService';
import api from '../services/api';
import Cookies from 'js-cookie';

const RecipeCard = ({ recipe, onDelete, onSave }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const authToken = Cookies.get('authToken');

  // Format image URL
  const imageUrl = recipe.image_url
    ? recipe.image_url.startsWith('https')
      ? recipe.image_url
      : `https://localhost:5001${recipe.image_url}`
    : '/assets/default-recipe.png';

  // Truncate title and description
  const truncatedTitle =
    recipe.title && recipe.title.length > 30
      ? `${recipe.title.slice(0, 30)}...`
      : recipe.title;

  const truncatedDescription =
    recipe.description && recipe.description.length > 60
      ? `${recipe.description.slice(0, 60)}...`
      : recipe.description;

  // Fetch saved status of the recipe
  const checkIfSaved = async () => {
    try {
      const response = await api.get(`/api/saved-recipes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const isSaved = response.data.some((savedRecipe) => savedRecipe.id === recipe.id);
      setSaved(isSaved);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [recipe.id]);

  useEffect(() => {
    checkIfSaved();
  }, [recipe.id]); 

  // Handle delete recipe
  const handleDelete = async () => {
    if (!authToken) {
      alert('You must be logged in to delete recipes.');
      return;
    }
  
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await deleteRecipe(recipe.id);
        if (response.status === 200) {
          onDelete(recipe.id);
        } else {
          alert(`Failed to delete recipe: ${response.message || 'Unknown error'}`);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Recipe already deleted
          onDelete(recipe.id);
        } else {
          console.error('Error deleting recipe:', error);
          alert('Failed to delete recipe. Please try again.');
        }
      }
    }
  };

  
  // Toggle save recipe (save/unsave)
  const handleSaveToggle = async () => {
    if (!authToken) {
      alert('You must be logged in to save recipes.');
      return;
    }

    try {
      const response = await api.post(
        '/api/saved-recipes/toggle-save',
        { recipeId: recipe.id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const isNowSaved = !saved; 
        setSaved(isNowSaved);

        // Update parent component (HomePage) with the saved status
        if (onSave) {
          onSave(recipe, isNowSaved);
        }
      } else {
        alert(`Failed to toggle save state: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving/unsaving recipe:', error);
      alert('Failed to save/unsave recipe. Please try again.');
    }
  };

  return (
    <div className="recipe-card">
      <div className="menu-container">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaEllipsisV />
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <a href={`/recipe-form/${recipe.id}`} className="menu-item">
              <FaEdit /> Edit
            </a>
            <a href={`/recipe/${recipe.id}`} className="menu-item">
              <FaEye /> View
            </a>
            <button className="menu-item saved" onClick={handleSaveToggle}>
              <FaHeart /> {saved ? 'Saved' : 'Save Recipe'}
            </button>
            <button className="menu-item delete" onClick={handleDelete}>
              <FaTrashAlt /> Delete
            </button>
          </div>
        )}
      </div>

      <img
        src={imageUrl}
        alt={recipe.title}
        className="recipe-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/assets/default-recipe.png';
        }}
      />

      <div className="recipe-details">
        <h3>{truncatedTitle}</h3>
        <p>{truncatedDescription}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
