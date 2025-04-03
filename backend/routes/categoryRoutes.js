import express from 'express';
import { fetchCategories, createCategoryHandler,fetchCategoryById } from '../controllers/categoryController.js';

const router = express.Router();

// Route to get all categories
router.get('/', fetchCategories); // Fetch all categories using the controller

// Route to create a new category
router.post('/', createCategoryHandler); // Handle category creation

router.get('/:id', fetchCategoryById);


export default router;
