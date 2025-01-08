import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
      const data = await response.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.ingredient_name}</li>
        ))}
      </ul>
      <h3>Categories:</h3>
      <ul>
        {recipe.categories.map((category, index) => (
          <li key={index}>{category.name}</li>
        ))}
      </ul>
      <h3>Comments:</h3>
      {recipe.comments.length > 0 ? (
        recipe.comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.comment}</p>
          </div>
        ))
      ) : (
        <p>No comments yet!</p>
      )}
    </div>
  );
};

export default RecipeDetail;
