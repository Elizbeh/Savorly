import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
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
      <p className="category-description">{category.description}</p>

      <h2 className="recipes-header">{`Recipes in ${category.name} category`}</h2>
      <div className="recipe-list">
        {recipes.length ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={(id) => setRecipes(recipes.filter((recipe) => recipe.id !== id))}
            />
          ))
        ) : (
          <p>No recipes found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
