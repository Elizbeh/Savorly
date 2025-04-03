import { 
  create as createRecipeModel, 
  getRecipes, 
  findById, 
  update,  
  getCategoriesForRecipe, 
  getIngredientsForRecipe
} from '../models/recipes.js';
import { addCategoriesToRecipe } from '../models/recipes_categories.js';
import { addCommentToRecipe, getCommentsForRecipe } from '../models/comments.js';
import { addRatingToRecipe } from '../models/ratings.js';
import upload from '../middleware/upload.js';
import path from 'path';
import fs from 'fs/promises';
import pool from '../config/db.js'

// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description, categories, ingredients } = req.body;

  if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
  }

  const userId = req.user.userId; // Make sure user is set in req.user
  if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
  }

  let imageUrl = null;
  if (req.file) {
      imageUrl = '/uploads/' + req.file.filename; // Assuming `upload` middleware saves the file
  }

  const connection = await pool.getConnection(); // Use a connection for transaction

  try {
      await connection.beginTransaction();

      // Create the recipe
      const [result] = await connection.query(
          'INSERT INTO recipes (title, description, user_id, image_url) VALUES (?, ?, ?, ?)',
          [title, description, userId, imageUrl]
      );
      const recipeId = result.insertId;

      // Add categories (if provided)
      if (categories && categories.length > 0) {
        const categoryValues = categories.map((catId) => [recipeId, catId]);
        await connection.query(
            'INSERT INTO recipe_categories (recipe_id, category_id) VALUES ?',
            [categoryValues]
        );
      }
      
      if (!Array.isArray(ingredients) || ingredients.some(ing => typeof ing !== 'string')) {
        return res.status(400).json({ message: 'Ingredients must be an array of strings.' });
      }    
        const ingredientValues = ingredients.map(ingredient => [recipeId, ingredient]);
        await connection.query(
            'INSERT INTO recipe_ingredients (recipe_id, ingredient_name) VALUES ?',
            [ingredientValues]
        );

      await connection.commit();
      res.status(201).json({ message: 'Recipe created successfully', recipeId });
    } catch (err) {
        await connection.rollback();
        console.error('Error creating recipe:', err);
        res.status(500).json({ message: 'Error creating recipe', error: err.message });
    } finally {
        connection.release();
  }
};


/*// Get all recipes
export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    console.log('Categories from DB:', categories); // Check categories here
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};*/



// Get recipe by ID
export const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const categories = await getCategoriesForRecipe(id);
    const ingredients = await getIngredientsForRecipe(id);
    const comments = await getCommentsForRecipe(id);

    res.status(200).json({ ...recipe, categories, ingredients, comments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipe', error: err.message });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  let imageUrl;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    // Fetch the existing recipe to get the current image URL
    const existingRecipe = await findById(id);
    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // If a new file is uploaded, handle the file update
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;

      // Delete the old image file if it exists
      if (existingRecipe.imageUrl) {
        const oldImagePath = path.join('uploads', path.basename(existingRecipe.imageUrl));
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err.message);
        }
      }
    } else {
      // Keep the existing image if no new file is uploaded
      imageUrl = existingRecipe.imageUrl;
    }

    // Update the recipe in the database
    const updated = await update({ id, title, description, imageUrl });
    if (!updated) {
      return res.status(404).json({ message: 'Recipe not updated' });
    }

    res.status(200).json({ message: 'Recipe updated successfully' });
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.userId;  // Correct way to access user ID from the token

  try {
    // Query the database for the recipe by ID
    const [recipe] = await pool.query('SELECT * FROM recipes WHERE id = ?', [recipeId]);

    if (recipe.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the current user is the creator (user_id should match)
    if (recipe[0].user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this recipe" });
    }

    // Proceed with deletion
    await pool.query('DELETE FROM recipes WHERE id = ?', [recipeId]);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

// Add a comment to a recipe
export const addCommentToRecipeHandler = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  if (!comment) {
    return res.status(400).json({ message: 'Comment is required' });
  }

  try {
    await addCommentToRecipe(id, userId, comment);
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// Add a rating to a recipe
export const addRatingToRecipeHandler = async (req, res) => {
  const { id } = req.params;
  const { ratings } = req.body;
  const userId = req.user.id;

  if (!ratings || isNaN(ratings) || ratings < 1 || ratings > 5) {
    return res.status(400).json({ message: 'Ratings must be between 1 and 5' });
  }

  try {
    await addRatingToRecipe(id, userId, ratings);
    res.status(201).json({ message: 'Rating added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding rating', error: err.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const { category } = req.query; // Get the category ID from query params
    const recipes = await getRecipes({ categoryId: category }); // Pass category filter
    console.log('Fetched recipes:', recipes);
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};


