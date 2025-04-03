import React, { useState } from 'react';
import './RecipeCard.css';
import { FaEllipsisV, FaTrashAlt, FaEdit, FaEye, FaHeart } from 'react-icons/fa';
import api from '../services/api'; // Import the configured axios instance
import Cookies from 'js-cookie';

const RecipeCard = ({ recipe, onDelete, onSave }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const authToken = Cookies.get('authToken'); // Get auth token

  // Debugging: Log the image URL to ensure correctness
  console.log("Recipe Image URL:", recipe.image_url);

  // Ensure image URL is absolute
  const imageUrl = recipe.image_url 
  ? recipe.image_url.startsWith('http') 
    ? recipe.image_url 
    : `http://localhost:5001${recipe.image_url}`  // Remove the extra slash before 'uploads'
  : '/assets/default-recipe.png';


  const truncatedDescription =
    recipe.description && recipe.description.length > 25
      ? `${recipe.description.slice(0, 25)}...`
      : recipe.description;

  const handleDelete = async () => {
    if (!authToken) {
      alert('You must be logged in to delete recipes.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/api/recipes${recipe.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        onDelete(recipe.id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    if (!authToken) {
      alert('You must be logged in to save recipes.');
      return;
    }

    if (!saved) {
      try {
        await api.post(
          '/api/recipes/save',
          { recipeId: recipe.id },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSaved(true);
        onSave(recipe);
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe. Please try again.');
      }
    } else {
      alert('Recipe already saved!');
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
            <button className="menu-item saved" onClick={handleSave}>
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
          e.target.src = '/assets/default-recipe.png'; // Set default image if error occurs
        }}
      />
      <div className="recipe-details">
        <h3>{recipe.title}</h3>
        <p>{truncatedDescription}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
