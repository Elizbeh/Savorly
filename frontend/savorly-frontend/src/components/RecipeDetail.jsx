import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeDetails.css'; // Ensure the CSS file is imported

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/recipes/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the request header
          },
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
  }, [id, authToken]); // Ensure authToken is considered in dependency array

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
      <h1 className="recipe-detail-title">{recipe.title}</h1>
      <img
        src={`http://localhost:5001${recipe.image_url}` || '/assets/default-recipe.png'}
        alt={recipe.title}
        className="recipe-detail-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/assets/default-recipe.png';
        }}
      />

      <p className="recipe-detail-description">{recipe.description}</p>

      <h3 className="recipe-section-title">Ingredients:</h3>
      <ul className="recipe-ingredients">
        {recipe.ingredients &&
          recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              {ingredient.ingredient_name}
            </li>
          ))}
      </ul>

      <h3 className="recipe-section-title">Categories:</h3>
      <ul className="recipe-categories">
        {recipe.categories &&
          recipe.categories.map((category, index) => (
            <li key={index} className="category-item">
              {category.name}
            </li>
          ))}
      </ul>

      <h3 className="recipe-section-title">Comments:</h3>
      <div className="recipe-comments">
        {recipe.comments && recipe.comments.length > 0 ? (
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
  );
};

export default RecipeDetail;
