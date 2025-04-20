import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndRecipes = async () => {
      try {
        const categoryResponse = await api.get(`/api/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        const recipeResponse = await api.get(`/api/recipes?category=${categoryId}`);
        setRecipes(recipeResponse.data);
      } catch (error) {
        console.error('Error fetching category or recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndRecipes();
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found.</p>;

  return (
    <div className="category-page">
      <h1 className="category-title">{category.name}</h1>
      <p className="category-description">{category.description}</p>

      <h2>Recipes in this category:</h2>
      <div className="recipe-list">
        {recipes.length ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={
                  recipe.image_url?.startsWith('http')
                    ? recipe.image_url
                    : `http://localhost:5001${recipe.image_url}`
                }
                alt={recipe.title}
                onError={(e) => (e.target.src = '/assets/default-recipe.png')}
              />
              <h3>{recipe.title}</h3>
              <p>{recipe.description?.slice(0, 100)}...</p>
            </div>
          ))
        ) : (
          <p>No recipes found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
