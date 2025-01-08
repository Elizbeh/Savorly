import { 
  create as createRecipeModel, 
  getRecipes, 
  findById, 
  update, 
  remove, 
  getCategoriesForRecipe, 
  getIngredientsForRecipe
} from '../models/recipes.js';
import { addCategoriesToRecipe } from '../models/recipes_categories.js';
import { addCommentToRecipe, getCommentsForRecipe } from '../models/comments.js';
import { addRatingToRecipe } from '../models/ratings.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description, categories, ingredients } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newRecipe = await createRecipeModel({
      title,
      description,
      userId: req.user.id,
    });

    if (categories && categories.length > 0) {
      await addCategoriesToRecipe(newRecipe.id, categories);
    }

    if (ingredients && ingredients.length > 0) {
      await addIngredientsToRecipe(newRecipe.id, ingredients);
    }

    return res.status(201).json({
      message: 'Recipe created successfully',
      recipeId: newRecipe.id,
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ message: 'Failed to create recipe' });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  const { userId, categoryId } = req.query;

  try {
    const recipes = await getRecipes({ userId, categoryId });
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ message: 'Database error', error: error.message });
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
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const updated = await update({ id, title, description });

    if (!updated) {
      return res.status(404).json({ message: 'Recipe not found or not updated' });
    }

    res.status(200).json({ message: 'Recipe updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await remove(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipe', error: err.message });
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
