import pool from '../config/db.js';

// Helper function to handle database errors
const handleDatabaseError = (error, message = 'Database error') => {
  console.error(error);
  throw new Error(message);
};

// Create a new recipe
export const create = async ({ title, description, userId, imageUrl }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO recipes (title, description, user_id, image_url) VALUES (?, ?, ?, ?)`,
      [title, description, userId, imageUrl]
    );
    return { id: result.insertId, title, description, userId, imageUrl };
  } catch (error) {
    handleDatabaseError(error, 'Error creating recipe');
  }
};

// Get all recipes with optional category filter
export const getRecipes = async (filters = {}) => {
  const { categoryId } = filters;
  try {
    if (categoryId) {
      // Filter recipes by category ID
      const [recipes] = await pool.query(
        `SELECT r.* 
         FROM recipes r
         INNER JOIN recipe_categories rc ON r.id = rc.recipe_id
         WHERE rc.category_id = ?`,
        [categoryId]
      );
      return recipes;
    }

    // If no filter, return all recipes
    const [recipes] = await pool.query('SELECT * FROM recipes');
    return recipes;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching recipes');
  }
};


// Find a recipe by ID
export const findById = async (id) => {
  console.log("Looking for recipe with id:", id);
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


