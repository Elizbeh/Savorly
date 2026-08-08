import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './RecipeDetails.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="recipe-detail-container">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-container">
        <div className="recipe-details-content">
          <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/home" className="home-btn-primary-small">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const imageUrl = recipe.image_url
    ? recipe.image_url.startsWith('http')
      ? recipe.image_url
      : `https://savorly.duckdns.org${recipe.image_url}`
    : '/assets/default-recipe.png';

  return (
    <div className="recipe-detail-container">
      {/* Hero Image */}
      {recipe.image_url && (
        <img
          src={imageUrl}
          alt={`${recipe.title} recipe`}
          className="recipe-detail-featured-img"
        />
      )}

      {/* Content */}
      <div className="recipe-details-content">
        <h1 className="recipe-detail-title">{recipe.title}</h1>
        <p className="recipe-detail-description">{recipe.description}</p>

        {/* Metadata Cards */}
        <div className="recipe-metadata">
          <p>
            <strong>Prep Time</strong>
            {recipe.prep_time || "N/A"} mins
          </p>
          <p>
            <strong>Cook Time</strong>
            {recipe.cook_time || "N/A"} mins
          </p>
          <p>
            <strong>Calories</strong>
            {recipe.calories || "N/A"} kcal
          </p>
        </div>

        {/* Ingredients */}
        <h3 className="recipe-section-title">Ingredients</h3>
        <ul className="recipe-ingredients">
          {recipe.ingredients?.length ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient.ingredient_name}
              </li>
            ))
          ) : (
            <p className="no-comments">No ingredients listed</p>
          )}
        </ul>

        {/* Categories */}
        {recipe.categories?.length > 0 && (
          <>
            <h3 className="recipe-section-title">Categories</h3>
            <ul className="recipe-categories">
              {recipe.categories.map((category, index) => (
                <li key={index} className="category-item">
                  {category.name}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Comments */}
        <h3 className="recipe-section-title">Comments</h3>
        <div className="recipe-comments">
          {recipe.comments?.length ? (
            recipe.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p>{comment.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;