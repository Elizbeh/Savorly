import { 
  create, 
  getRecipes, 
  findById, 
  update,  
  remove
} from '../models/recipes.js';
import { addCategoriesToRecipe,  getCategoriesForRecipe } from '../models/recipes_categories.js';
import { addIngredientsToRecipe, getIngredientsForRecipe } from '../models/ingredients.js';
import { addCommentToRecipe, getCommentsForRecipe } from '../models/comments.js';
import { addRatingToRecipe } from '../models/ratings.js';
import pool from '../config/db.js'
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier'; 


// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description, ingredients, categories } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    let imageUrl = null;

    const handleRecipeCreation = async (imageUrl) => {
      // Step 1: Create recipe
      const recipe = await create({ title, description, userId, imageUrl });

      // Step 2: Add ingredients if provided
      if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
        await addIngredientsToRecipe(recipe.id, ingredients);
      }

      // Step 3: Add categories if provided
      if (categories && Array.isArray(categories) && categories.length > 0) {
        await addCategoriesToRecipe(recipe.id, categories);
      }

      // Step 4: Fetch related data
      const fullIngredients = await getIngredientsForRecipe(recipe.id);
      const fullCategories = await getCategoriesForRecipe(recipe.id);
      const comments = await getCommentsForRecipe(recipe.id);

      // Step 5: Respond
      res.status(201).json({
        ...recipe,
        ingredients: fullIngredients,
        categories: fullCategories,
        comments,
      });
    };

    // If image is provided
    if (req.file) {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'recipe_images',
          resource_type: 'image',
        },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ message: 'Image upload failed', error });
          }

          imageUrl = result.secure_url;
          await handleRecipeCreation(imageUrl);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // No image uploaded
      await handleRecipeCreation(null);
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
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

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  try {
    // Retrieve the recipe by ID from the database
    const [recipe] = await pool.query('SELECT * FROM recipes WHERE id = ?', [recipeId]);

    if (recipe.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is authorized to delete the recipe
    if (recipe[0].user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
    }

    // Retrieve the image public_id from the recipe
    const imagePublicId = recipe[0].image_url ? extractPublicIdFromUrl(recipe[0].image_url) : null;

    // If an image exists, delete it from Cloudinary
    if (imagePublicId) {
      cloudinary.v2.uploader.destroy(imagePublicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete failed:', error);
          return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error });
        }
        console.log('Image deleted from Cloudinary:', result);
      });
    }

    // Proceed with deleting the recipe from the database
    const success = await remove(recipeId);
    if (success) {
      return res.status(200).json({ message: 'Recipe deleted successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to delete recipe' });
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Failed to delete recipe', error: error.message });
  }
};

// Helper function to extract the public_id from the Cloudinary image URL
const extractPublicIdFromUrl = (url) => {
  const regex = /\/([a-zA-Z0-9-_]+)\./;
  const match = url.match(regex);
  return match ? match[1] : null;
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
