import pool from '../config/db.js';


// Fetch all categories - just return data, don't send response here
export const getAllCategories = async () => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    return categories; // Return the categories to the controller
  } catch (err) {
    throw new Error('Error fetching categories: ' + err.message);
  }
};


// Create a new category
export const createCategory = async (name) => {
  try {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return { id: result.insertId, name };
  } catch (err) {
    throw new Error('Error creating category: ' + err.message);
  }
};


// Fetch a category by ID
export const getCategoryById = async (id) => {
  try {
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return category[0] || null;
  } catch (err) {
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};