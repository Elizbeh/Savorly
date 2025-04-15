import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import RecipeCard from '../components/RecipeCard';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setError('Category ID is missing.');
      return;
    }

    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await fetch(`http://localhost:5001/api/categories/${categoryId}`);
        if (!categoryResponse.ok) throw new Error('Failed to fetch category');
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        const recipeResponse = await fetch(`http://localhost:5001/api/recipes?category=${categoryId}`);
        if (!recipeResponse.ok) throw new Error('Failed to fetch recipes');
        const recipeData = await recipeResponse.json();
        setRecipes(recipeData);
      } catch (error) {
        setError('Unable to load category or recipes. Please try again.');
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  // Prevent accessing category.name before it's set
  if (!category) {
    return <div>Loading category...</div>; // Optionally, add a loading state
  }

  return (
    <div className="category-page">
      {error && <div className="error">{error}</div>}

      

      <section className="recipes-list">
        <h2>Recipe in the {category.name} category</h2>
        {recipes.length ? (
          <div className="recipe-cards">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>No recipes available in this category.</p>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
