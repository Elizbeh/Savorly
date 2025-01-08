import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('http://localhost:5000/api/recipes');
      const data = await response.json();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Recipe List</h1>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <Link to={`/recipe/${recipe.id}`}>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
