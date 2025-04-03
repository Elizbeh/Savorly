import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RecipeFormPage.css';
import { FaTimes } from 'react-icons/fa';
import api from '../services/api';  // Import your custom Axios instance
import Cookies from 'js-cookie';  // Import the js-cookie library for cookie handling

const RecipeForm = () => {
  const { id } = useParams(); // Get the recipe ID (if editing)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorLoadingCategories, setErrorLoadingCategories] = useState(false);

  const navigate = useNavigate();

  // Helper function to create FormData
  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    ingredients.forEach((ingredient) => formData.append('ingredients[]', ingredient));
    selectedCategories.forEach((category) => formData.append('categories[]', category));
    if (image) formData.append('image', image);
    return formData;
  };

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories'); // Use custom Axios instance
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (err) {
        console.error(err);
        setErrorLoadingCategories(true);
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch existing recipe if in edit mode
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/api/recipes/${id}`); // Use custom Axios instance
          const data = response.data;

          setTitle(data.title || '');
          setDescription(data.description || '');
          setIngredients(data.ingredients.map((ingredient) => ingredient.ingredient_name || ''));
          setSelectedCategories(data.categories.map((category) => category.id));
          setImagePreview(data.image_url ? `http://localhost:5001${data.image_url}` : null);
        } catch (error) {
          console.error('Error fetching recipe:', error);
        }
      };

      fetchRecipe();
    }
  }, [id]);

  const validateForm = () => {
    if (title.trim().length < 5) {
      alert('Title must be at least 5 characters long.');
      return false;
    }
    if (description.trim().length < 20) {
      alert('Description must be at least 20 characters long.');
      return false;
    }

    // Only check if there is at least one filled ingredient
    const filledIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
    if (filledIngredients.length === 0) {
      alert('Please fill in at least one ingredient.');
      return false;
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for the token in cookies
    const token = Cookies.get('authToken');  // Retrieve the token from cookies
    if (!token) {
      alert('Please log in to create or edit a recipe.');
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    const formData = createFormData();

    try {
      setIsLoading(true);
      const response = id
        ? await api.put(`/api/recipes/${id}`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
        : await api.post('/api/recipes/create', formData, { headers: { 'Authorization': `Bearer ${token}` } });

      if (response.status === 200 || response.status === 201) {
        alert(id ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        navigate('/'); // Navigate to home page after successful submit
      } else {
        alert('Error submitting recipe');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Error submitting recipe');
    } finally {
      setIsLoading(false);
    }
  };

  // Ingredient input handlers
  const handleIngredientChange = (e) => {
    const value = e.target.value;
    const newIngredients = [...ingredients];
    newIngredients[ingredients.length - 1] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    const lastIngredient = ingredients[ingredients.length - 1].trim();
    if (lastIngredient) {
      setIngredients([...ingredients, '']);
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      handleAddIngredient();
      e.target.value = ''; // Clear the input field after adding
    }
  };

  return (
    <form className="create-recipe-form" onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Recipe' : 'Create a Recipe'}</h2>

      {/* Recipe Title */}
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      {/* Recipe Description */}
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </label>

      {/* Ingredients */}
      <label>
        Ingredients:
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            ingredient.trim() && (
              <div key={index} className="ingredient-chip">
                {ingredient}
                <button
                  type="button"
                  className="remove-ingredient-button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <FaTimes />
                </button>
              </div>
            )
          ))}
        </div>

        <input
          type="text"
          value={ingredients[ingredients.length - 1] || ''}
          onChange={handleIngredientChange}
          onKeyDown={handleIngredientKeyDown}
          placeholder="Enter ingredient"
        />

        <button
          type="button"
          className="add-ingredient-button"
          onClick={handleAddIngredient}
        >
          + Add Ingredient
        </button>
      </label>

      {/* Categories */}
      <label>
        Categories:
        {loadingCategories ? (
          <p>Loading categories...</p>
        ) : errorLoadingCategories ? (
          <p>Error loading categories</p>
        ) : (
          <select
            multiple
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories([...e.target.selectedOptions].map((opt) => opt.value))
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </label>

      {/* Image Upload */}
      <label>
        Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && <img src={imagePreview} alt="Preview" />}
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default RecipeForm;
