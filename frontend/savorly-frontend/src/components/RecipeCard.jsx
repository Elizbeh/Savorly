import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV, FaTrashAlt, FaEdit, FaEye, FaHeart } from 'react-icons/fa';
import './RecipeCard.css';
import handleSaveToggle from '../utils/handleSaveToggle';
import handleDelete from '../utils/handleDelete';
import api from '../services/api';
import Toast from './Toast';
import { useAuth } from '../contexts/AuthContext';

/**
 * RecipeCard Component
 * 
 * Displays a recipe card with:
 * - Recipe image with fallback
 * - Title and description (truncated)
 * - Three-dot menu with actions (View, Edit, Save, Delete)
 * - Save/unsave functionality
 * - Delete functionality
 * - Accessible keyboard navigation
 * - Toast notifications for user feedback
 * 
 * @param {Object} recipe - Recipe data object
 * @param {Function} onDelete - Callback when recipe is deleted
 * @param {Function} onSave - Callback when recipe is saved/unsaved
 */
const RecipeCard = ({ recipe, onDelete, onSave }) => {
  // State management
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const menuRef = useRef(null);
  const { user } = useAuth();

  // Image URL with fallback
  const imageUrl = recipe.image_url
    ? recipe.image_url.startsWith('https')
      ? recipe.image_url
      : `https://localhost:5001${recipe.image_url}`
    : '/assets/default-recipe.png';

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const truncatedTitle = truncateText(recipe.title, 50);
  const truncatedDescription = truncateText(recipe.description, 100);

  /**
   * Check if recipe is saved by current user
   */
  const checkIfSaved = async () => {
    if (!user) {
      setSaved(false);
      return;
    }

    try {
      const response = await api.get('/api/saved-recipes');
      const isSaved = response.data.some((savedRecipe) => savedRecipe.id === recipe.id);
      setSaved(isSaved);
    } catch (error) {
      if (error.response?.status === 401) {
        setSaved(false);
      } else {
        console.error('Error fetching saved recipes:', error);
      }
    }
  };

  // Check saved status on mount and when recipe changes
  useEffect(() => {
    checkIfSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id, user]);

  /**
   * Close menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  /**
   * Handle keyboard navigation for menu
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  /**
   * Show toast message (prevent multiple toasts)
   */
  const showToast = (message) => {
    if (!toastMessage) {
      setToastMessage(message);
    }
  };

  /**
   * Handle delete action
   */
  const handleDeleteClick = async () => {
    if (!user) {
      showToast('You must be logged in to delete recipes.');
      return;
    }

    // Close menu
    setMenuOpen(false);
    setIsLoading(true);

    handleDelete({
      recipeId: recipe.id,
      user,
      onSuccess: () => {
        showToast('Recipe deleted successfully.');
        onDelete?.();
      },
      onError: (error) => {
        console.error('Delete failed:', error);
        showToast('Failed to delete recipe. Please try again.');
        setIsLoading(false);
      },
      setMessage: setToastMessage
    });
  };

  /**
   * Handle save/unsave toggle
   */
  const handleToggleClick = async () => {
    if (!user) {
      showToast('You must be logged in to save recipes.');
      return;
    }

    // Close menu
    setMenuOpen(false);
    setIsLoading(true);

    handleSaveToggle(
      recipe.id,
      (data) => {
        setSaved(data.saved);
        showToast(data.saved ? 'Recipe saved successfully.' : 'Recipe removed from saved.');
        onSave?.(data);
        setIsLoading(false);
      },
      (error) => {
        showToast(error);
        setIsLoading(false);
      }
    );
  };

  /**
   * Toggle menu open/close
   */
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <article 
        className={`recipe-card ${saved ? 'is-saved' : ''} ${isLoading ? 'loading' : ''}`}
        aria-labelledby={`recipe-title-${recipe.id}`}
        onKeyDown={handleKeyDown}
      >
        {/* Three-Dot Menu */}
        <div className="menu-container" ref={menuRef}>
          <button
            className="menu-button"
            onClick={toggleMenu}
            aria-label="Open recipe actions menu"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <FaEllipsisV aria-hidden="true" />
          </button>

          {menuOpen && (
            <div 
              className="menu-dropdown"
              role="menu"
              aria-label="Recipe actions"
            >
              <Link
                to={`/recipe/${recipe.id}`}
                className="menu-item"
                role="menuitem"
                aria-label={`View ${recipe.title} recipe details`}
                onClick={() => setMenuOpen(false)}
              >
                <FaEye aria-hidden="true" />
                <span>View</span>
              </Link>

              {user && (
                <Link
                  to={`/recipe-form/${recipe.id}`}
                  className="menu-item"
                  role="menuitem"
                  aria-label={`Edit ${recipe.title} recipe`}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaEdit aria-hidden="true" />
                  <span>Edit</span>
                </Link>
              )}

              <button
                className={`menu-item ${saved ? 'saved' : ''}`}
                onClick={handleToggleClick}
                role="menuitem"
                aria-label={saved ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title} recipe`}
                disabled={isLoading}
              >
                <FaHeart aria-hidden="true" />
                <span>{saved ? 'Unsave' : 'Save'}</span>
              </button>

              {user && (
                <button
                  className="menu-item delete"
                  onClick={handleDeleteClick}
                  role="menuitem"
                  aria-label={`Delete ${recipe.title} recipe`}
                  disabled={isLoading}
                >
                  <FaTrashAlt aria-hidden="true" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recipe Image */}
        <Link 
          to={`/recipe/${recipe.id}`}
          aria-label={`View ${recipe.title} recipe`}
        >
          <img
            src={imageUrl}
            alt={recipe.title ? `${recipe.title} recipe` : 'Recipe image'}
            className="recipe-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/default-recipe.png';
            }}
          />
        </Link>

        {/* Recipe Details */}
        <Link 
          to={`/recipe/${recipe.id}`}
          className="recipe-details"
          aria-label={`View ${recipe.title} recipe details`}
        >
          <h3 id={`recipe-title-${recipe.id}`}>
            {truncatedTitle}
          </h3>
          {recipe.description && (
            <p>{truncatedDescription}</p>
          )}
        </Link>
      </article>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      )}
    </>
  );
};

export default RecipeCard;