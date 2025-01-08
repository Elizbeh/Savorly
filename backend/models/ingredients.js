
import pool from '../config/db.js';

// Add ingredients to a recipe
export const addIngredientsToRecipe = async (recipeId, ingredients) => {
  try {
    const values = ingredients.map(ingredient => [recipeId, ingredient]);
    await pool.query('INSERT INTO recipe_ingredients (recipe_id, ingredient_name) VALUES ?', [values]);
    return true;
  } catch (err) {
    throw new Error('Error adding ingredients: ' + err.message);
  }
};

// Get ingredients for a recipe
export const getIngredientsForRecipe = async (recipeId) => {
  try {
    const [ingredients] = await pool.query(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
      [recipeId]
    );
    return ingredients;
  } catch (error) {
    // Adding a more descriptive error message
    throw new Error('Error fetching ingredients: ' + error.message);
  }
};


