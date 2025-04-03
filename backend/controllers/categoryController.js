import { getAllCategories, createCategory, getCategoryById } from '../models/categories.js';

// Fetch all categories and send as response
export const fetchCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};


// Create a new category
export const createCategoryHandler = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await createCategory(name);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

// Fetch category by ID and send as a response
export const fetchCategoryById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const category = await getCategoryById(id); // Call the model function to get the category
    if (!category) {
      return res.status(404).json({ message: 'Category not found' }); // Return 404 if no category exists
    }
    res.status(200).json(category); // Return the category if found
  } catch (err) {
    console.error('Error fetching category by ID:', err);
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};

