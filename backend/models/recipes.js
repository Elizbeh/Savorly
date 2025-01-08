

// **recipes.js (Model)**
import pool from '../config/db.js';

// Helper function to handle database errors
const handleDatabaseError = (error, message = 'Database error') => {
  console.error(error);
  throw new Error(message);
};

// Create a new recipe
export const create = async ({ title, description, userId }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO recipes (title, description, user_id) VALUES (?, ?, ?)`,
      [title, description, userId]
    );
    return { id: result.insertId, title, description, userId };
  } catch (error) {
    handleDatabaseError(error, 'Error creating recipe');
  }
};

// Get all recipes with optional filters
export const getRecipes = async ({ userId, categoryId }) => {
  const queryParams = [];
  let query = `
    SELECT recipes.*, users.first_name, users.last_name 
    FROM recipes
    INNER JOIN users ON recipes.user_id = users.id
  `;

  if (userId) {
    query += ' WHERE recipes.user_id = ?';
    queryParams.push(userId);
  }

  if (categoryId) {
    query += userId ? ' AND' : ' WHERE';
    query += `
      EXISTS (
        SELECT 1 FROM recipe_categories 
        WHERE recipe_categories.recipe_id = recipes.id 
          AND recipe_categories.category_id = ?
      )
    `;
    queryParams.push(categoryId);
  }

  try {
    const [recipes] = await pool.query(query, queryParams);
    return recipes;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching recipes');
  }
};

// Find a recipe by ID
export const findById = async (id) => {
  try {
    const [recipe] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    return recipe[0] || null;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching recipe');
  }
};

// Update a recipe's details
export const update = async ({ id, title, description }) => {
  try {
    const [result] = await pool.query(
      `UPDATE recipes SET title = ?, description = ? WHERE id = ?`,
      [title, description, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    handleDatabaseError(error, 'Error updating recipe');
  }
};

// Delete a recipe by ID
export const remove = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    handleDatabaseError(error, 'Error deleting recipe');
  }
};

// Helper function to get ingredients for a recipe
export const getIngredientsForRecipe = async (recipeId) => {
  try {
    // Correcting the table name to 'recipe_ingredients'
    const [ingredients] = await pool.query(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
      [recipeId]
    );
    return ingredients;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching ingredients');
  }
};


// Additional helper function to fetch categories related to a recipe
export const getCategoriesForRecipe = async (recipeId) => {
  try {
    const [categories] = await pool.query(
      'SELECT categories.* FROM categories INNER JOIN recipe_categories ON categories.id = recipe_categories.category_id WHERE recipe_categories.recipe_id = ?',
      [recipeId]
    );
    return categories;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching categories for recipe');
  }
};

// Add ingredients to a recipe
export const addIngredientsToRecipe = async (recipeId, ingredients) => {
  const values = ingredients.map(ingredient => [recipeId, ingredient]);

  try {
    const [result] = await pool.query(
      'INSERT INTO ingredients (recipe_id, ingredient) VALUES ?',
      [values]
    );
    return result;
  } catch (error) {
    handleDatabaseError(error, 'Error adding ingredients to recipe');
  }
};

