import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie
import './RecipeDetails.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const authToken = Cookies.get('authToken');

  // Log all cookies to check what's in there
  useEffect(() => {
    const authToken = Cookies.get('authToken');
  
    if (!authToken) {
      console.error('Authentication token is missing.');
      return;
    }
  
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/recipes/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
  
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
  
    fetchRecipe();
  }, [id]);  // Only fetch when `id` changes
  

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!authToken) {
        console.error("Authentication token is missing.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/recipes/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    if (authToken) {
      fetchRecipe();
    }
  }, [id, authToken]);
  
  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
  <img
    src={recipe.image_url ? recipe.image_url.startsWith('http') ? recipe.image_url : `http://localhost:5001${recipe.image_url}` : '/assets/default-recipe.png'}
    alt={recipe.title}
    className="recipe-detail-image"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/assets/default-recipe.png';
    }}
  />

  <div className="recipe-details-content">
    <h1 className="recipe-detail-title">{recipe.title}</h1>
    <p className="recipe-detail-description">{recipe.description}</p>

    <h3 className="recipe-section-title">Ingredients:</h3>
    <ul className="recipe-ingredients">
      {recipe.ingredients?.map((ingredient, index) => (
        <li key={index} className="ingredient-item">{ingredient.ingredient_name}</li>
      ))}
    </ul>

    <h3 className="recipe-section-title">Categories:</h3>
    <ul className="recipe-categories">
      {recipe.categories?.map((category, index) => (
        <li key={index} className="category-item">{category.name}</li>
      ))}
    </ul>

    <h3 className="recipe-section-title">Comments:</h3>
    <div className="recipe-comments">
      {recipe.comments?.length ? (
        recipe.comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>{comment.comment}</p>
          </div>
        ))
      ) : (
        <p className="no-comments">No comments yet!</p>
      )}
    </div>
  </div>
</div>

  );
};

export default RecipeDetail;
