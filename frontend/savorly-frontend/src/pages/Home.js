import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Custom styling for the page

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null); // Will store user info once authenticated

  // Fetch recipes and categories
  useEffect(() => {
    // Check if user is logged in and set the user state accordingly
    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Or use session token/cookie
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    // Fetch recipes and categories dynamically from the backend API
    const fetchRecipesAndCategories = async () => {
      try {
        // Fetch recipes from the backend
        const recipeResponse = await fetch('/api/recipes');
        const recipeData = await recipeResponse.json();
        setRecipes(recipeData);

        // Fetch categories from the backend (assuming you will implement the route)
        const categoryResponse = await fetch('/api/categories');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRecipesAndCategories();
  }, []);

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <img
            src="/assets/logo.png"  // Assuming logo.png is placed in your public/assets folder
            alt="Savorly Logo"
            className="logo-icon"
          />
          <span className="logo-text">Savorly</span>
        </div>

        <div className="nav-links">
          <Link to="/profile">Profile</Link>
          <Link to="/create-recipe">Create Recipe</Link>
          <Link to="/saved-recipes">Saved Recipes</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        {/* Welcome message */}
        {user && <h2>Welcome back, {user.first_name}!</h2>}

        {/* Categories Section */}
        <section className="categories">
          <h2>Explore Categories</h2>
          <div className="category-list">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="category-card"
                >
                  <div className="category-name">{category.name}</div>
                </Link>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </section>

        {/* Recipe List Section */}
        <section className="recipe-list">
          <h2>Featured Recipes</h2>
          <div className="recipes">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <img
                    src={recipe.imageUrl || '/assets/default-image.jpg'} // Fallback image if recipe doesn't have one
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description.slice(0, 100)}...</p>
                  <Link to={`/recipe/${recipe.id}`}>
                    <button className="view-button">View Recipe</button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No recipes available</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
