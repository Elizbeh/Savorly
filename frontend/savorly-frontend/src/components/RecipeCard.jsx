import React, { useState, useEffect } from 'react';
import './RecipeCard.css';
import { FaEllipsisV, FaTrashAlt, FaEdit, FaEye, FaHeart } from 'react-icons/fa';
import handleSaveToggle from '../utils/handleSaveToggle';
import handleDelete from '../utils/handleDelete';
import api from '../services/api';
import Toast from './Toast';
import { useAuth } from '../contexts/AuthContext';


const RecipeCard = ({ recipe, onDelete, onSave }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const { user } = useAuth();

  const imageUrl = recipe.image_url
    ? recipe.image_url.startsWith('https')
      ? recipe.image_url
      : `https://localhost:5001${recipe.image_url}`
    : '/assets/default-recipe.png';

  const truncatedTitle =
    recipe.title && recipe.title.length > 30 ? `${recipe.title.slice(0, 30)}...` : recipe.title;

  const truncatedDescription =
    recipe.description && recipe.description.length > 60
      ? `${recipe.description.slice(0, 60)}...`
      : recipe.description;

  const checkIfSaved = async () => {
    try {
      const response = await api.get(`/api/saved-recipes`);
      const isSaved = response.data.some((savedRecipe) => savedRecipe.id === recipe.id);
      setSaved(isSaved);
    } catch (error) {
      if (error.response?.status === 401) {
        setSaved(false);
      } else {
        console.error('Error fetching saved recipes:', error);
        showToast(error.message || 'Error fetching saved recipes'); // Use showToast
      }
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [recipe.id]);

  // Helper to prevent multiple toasts at once
  const showToast = (message) => {
    if (!toastMessage) {
      setToastMessage(message);
    }
  };

  const handleDeleteClick = () => {
  console.log('Recipe ID to delete:', recipe.id);
  console.log('Current cookies:', document.cookie);

  handleDelete({
  recipeId: recipe.id,
  user,
  onSuccess: () => {
    onDelete?.();
    setToastMessage("Recipe deleted successfully.");
  },
  onError: (err) => {
    console.error("❌ Delete failed:", err);
  },
  setMessage: setToastMessage
});
};


  const handleToggleClick = () => {
  if (!user) {
    showToast('You must be logged in to save recipes.');
    return;
  }

  handleSaveToggle(
    recipe.id,
    (data) => {
      setSaved(data.saved);
      showToast(data.saved ? 'Recipe saved.' : 'Recipe unsaved.');
    },
    (error) => showToast(error)
  );
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
            <button className="menu-item saved" onClick={handleToggleClick}>
              <FaHeart /> {saved ? 'Saved' : 'Save Recipe'}
            </button>
            <button className="menu-item delete" onClick={handleDeleteClick}>
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

      {/* 🆕 Toast component */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default RecipeCard;
