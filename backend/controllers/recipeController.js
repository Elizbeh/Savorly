import { 
  create, 
  getRecipes, 
  findById, 
  update,  
  getCategoriesForRecipe, 
  getIngredientsForRecipe
} from '../models/recipes.js';
import { addCategoriesToRecipe } from '../models/recipes_categories.js';
import { addCommentToRecipe, getCommentsForRecipe } from '../models/comments.js';
import { addRatingToRecipe } from '../models/ratings.js';
import pool from '../config/db.js'
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier'; 
// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;  // Assuming userId is stored in the request by authenticate middleware

  // Ensure title and description are provided
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    let imageUrl = null;
    if (req.file) {
      // Upload recipe image to Cloudinary
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'recipe_images', // Folder name for recipe images
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ message: 'Upload failed', error });
          }

          imageUrl = result.secure_url; // Get the image URL from Cloudinary

          // Now create the recipe with the image URL
          create({ title, description, userId, imageUrl })
            .then(recipe => {
              res.status(201).json(recipe); // Send the created recipe back
            })
            .catch(error => {
              res.status(500).json({ message: 'Error creating recipe', error });
            });
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // If no image, just create the recipe without an image
      create({ title, description, userId, imageUrl: null })
        .then(recipe => {
          res.status(201).json(recipe); // Send the created recipe back
        })
        .catch(error => {
          res.status(500).json({ message: 'Error creating recipe', error });
        });
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

// Update recipe (with optional image upload)
export const updateRecipe = async (req, res) => {
  const { id, title, description } = req.body;

  // Ensure required fields are provided
  if (!id || !title || !description) {
    return res.status(400).json({ message: 'ID, title, and description are required' });
  }

  try {
    let imageUrl = null;
    if (req.file) {
      // Upload new recipe image to Cloudinary
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'recipe_images', // Folder name for recipe images
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ message: 'Upload failed', error });
          }

          imageUrl = result.secure_url; // Get the image URL from Cloudinary

          // Now update the recipe with the new image URL
          update({ id, title, description, imageUrl })
            .then(success => {
              if (success) {
                res.status(200).json({ message: 'Recipe updated successfully' });
              } else {
                res.status(400).json({ message: 'Recipe update failed' });
              }
            })
            .catch(error => {
              res.status(500).json({ message: 'Error updating recipe', error });
            });
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // If no image is provided, just update the recipe without changing the image
      update({ id, title, description })
        .then(success => {
          if (success) {
            res.status(200).json({ message: 'Recipe updated successfully' });
          } else {
            res.status(400).json({ message: 'Recipe update failed' });
          }
        })
        .catch(error => {
          res.status(500).json({ message: 'Error updating recipe', error });
        });
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
};

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


