// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api'; // import the Axios instance
import './RecipeDetails.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
      <img
        src={
          recipe.image_url
            ? recipe.image_url.startsWith('http')
              ? recipe.image_url
              : `http://localhost:5001${recipe.image_url}`
            : '/assets/default-recipe.png'
        }
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
