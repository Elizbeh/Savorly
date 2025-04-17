import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Cookies from 'js-cookie';
import './SavedRecipes.css';

const RECIPES_PER_PAGE = 6;

const SavedRecipes = ({ savedRecipesProp, setSavedRecipesProp }) => {
  const [savedRecipes, setSavedRecipes] = useState(savedRecipesProp || []);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [itemsToShow, setItemsToShow] = useState(6);
  const [currentPage, setCurrentPage] = useState(1)

  const authToken = Cookies.get('authToken');

  useEffect(() => {
    if (!savedRecipesProp) {
      const fetchSavedRecipes = async () => {
        if (!authToken) {
          setMessage({ type: 'error', text: 'You must be logged in to view saved recipes.' });
          return;
        }

        try {
          const response = await api.get('/api/saved-recipes', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setSavedRecipes(response.data);
        } catch (error) {
          console.error('Error fetching saved recipes:', error);
          setMessage({ type: 'error', text: 'Failed to load saved recipes. Please try again.' });
        }
      };
      fetchSavedRecipes();
    }
  }, [savedRecipesProp, authToken]);

  const handleToggleSave = async (recipeId) => {
    if (!authToken) {
      setMessage({ type: 'error', text: 'You must be logged in to unsave a recipe.' });
      return;
    }

    try {
      const response = await api.delete('/api/saved-recipes/unsave', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { recipeId },
      });

      if (response.status == 200) {
        const updated = savedRecipes.filter((r) => r.id !== recipeId);
        setSavedRecipes(updated);
      }
 
      //Adjust current page if last item on last page was
      const maxPage = Math.ceil(updated.length /RECIPES_PER_PAGE);
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }

      setMessage({type: 'success', text: 'Recipe removed from saved.'})
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      setMessage({ type: 'error', text: 'Failed to unsave recipe. Try again.' });
    } 
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

  return (
    <div className="saved-recipes-container">
      <h2>Saved Recipes</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      {currentRecipes.length ? (
        <>
          <div className="recipes-grid">
            {currentRecipes.slice(0, itemsToShow).map((recipe) => (
              <div key={recipe.id} className="saved-recipe-item">
                <img
                  src={recipe.image_url || '/default_recipe_image.png'}
                  alt={recipe.title}
                  className="recipe-image"
                />
                <h3>{recipe.title}</h3>
                <p>{recipe.description || 'No description available.'}</p>

                <div className="actions">
                  <button className="unsave-button" onClick={() => handleToggleSave(recipe.id)}>
                    Remove from Saved
                  </button>
                  <Link to={`/recipe/${recipe.id}`} className="info-link" title="View Details">
                    <span role="img" aria-label="info">ℹ️</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ⬅️ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={i + 1 === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ➡️
            </button>
          </div>
        </>
      ) : (
        <p>No saved recipes found.</p>
      )}
    </div>
  );
};

export default SavedRecipes;
