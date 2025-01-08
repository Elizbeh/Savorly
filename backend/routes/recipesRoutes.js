import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authenticate } from '../middleware/authenticate.js';
import { addRatingToRecipe } from '../models/ratings.js'
import { addCommentToRecipe } from '../models/comments.js'
import { getAllCategories } from '../controllers/categoryController.js';


const router = express.Router();

router.post('/', authenticate, createRecipe); // Create a new recipe

router.get('/', getAllRecipes); // Fetch all recipes

router.get('/:id', getRecipeById); // Fetch a single recipe by ID

router.put('/:id', authenticate, updateRecipe); // Update a recipe

router.delete('/:id', authenticate, deleteRecipe); // Delete a recipe

// Route to add a comment to a recipe
router.post('/:id/comments', authenticate, addCommentToRecipe);

// Route to add a rating to a recipe
router.post('/:id/ratings', authenticate, addRatingToRecipe);


export default router;
