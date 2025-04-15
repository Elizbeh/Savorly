import express from 'express';

import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authenticate } from '../middleware/authenticate.js';
import { addRatingToRecipe } from '../models/ratings.js';
import { addCommentToRecipe } from '../models/comments.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', authenticate, upload.single('image'), createRecipe); // Create a new recipe

router.get('/', getAllRecipes); // Fetch all recipes

router.get('/:id', getRecipeById); // Fetch a single recipe by ID

// Update a recipe
router.put('/:id', authenticate, upload.single('image'), updateRecipe);

// Delete a recipe
router.delete('/:id', authenticate, deleteRecipe);

// Route to add a comment to a recipe
router.post('/:id/comments', authenticate, addCommentToRecipe);

// Route to add a rating to a recipe
router.post('/:id/ratings', authenticate, addRatingToRecipe);

export default router;
