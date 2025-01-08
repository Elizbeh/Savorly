import pool from '../config/db.js';

// Fetch all categories
export const getAllCategories = async () => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    return categories;
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
