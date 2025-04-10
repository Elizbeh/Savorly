import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RecipeFormPage.css';
import { FaTimes } from 'react-icons/fa';
import api from '../services/api';

const RecipeForm = () => {
  const { id } = useParams(); // Get the recipe ID (if editing)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For previewing image
  const [existingImageUrl, setExistingImageUrl] = useState(null); // Store the existing image URL
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorLoadingCategories, setErrorLoadingCategories] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();

  // Helper function to create FormData
  const createFormData = () => {
    const formData = new FormData();
    formData.append('id', id);  // Include the recipe ID
    formData.append('title', title);
    formData.append('description', description);
  
    // Filter out empty ingredients before appending to FormData
    ingredients.filter(ingredient => ingredient.trim() !== '').forEach((ingredient) => formData.append('ingredients[]', ingredient));
  
    selectedCategories.forEach((category) => formData.append('categories[]', category));
  
    // If a new image is uploaded, append it, else append the existing image URL
    if (image) {
      formData.append('image', image);
    } else if (existingImageUrl) {
      formData.append('existingImageUrl', existingImageUrl);
    }
  
    // Log the FormData contents (for debugging purposes)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    return formData;
  };
  
  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
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
          const response = await api.get(`/api/recipes/${id}`);
          const data = response.data;
          console.log("Fetched recipe", data);

          setTitle(data.title || '');
          setDescription(data.description || '');
          setIngredients(data.ingredients.map((ingredient) => ingredient.ingredient_name || ''));
          setSelectedCategories(data.categories.map((category) => category.id));
          setExistingImageUrl(data.image_url);
          
          // Check if we have an existing image URL, then set the preview
          if (data.image_url) {
            setImagePreview(data.image_url); 
          }
        } catch (error) {
          console.error('Error fetching recipe:', error);
        }
      };

      fetchRecipe();
    }
  }, [id]);

  const validateForm = () => {
    if (title.trim().length < 5) {
      setErrorMessage('Title must be at least 5 characters long.');
      return false;
    }
    if (description.trim().length < 20) {
      setErrorMessage('Description must be at least 20 characters long.');
      return false;
    }

    // Only check if there is at least one filled ingredient
    const filledIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
    if (filledIngredients.length === 0) {
      setErrorMessage('Please fill in at least one ingredient.');
      return false;
    }

    if (selectedCategories.length === 0) {
      setErrorMessage('Please select at least one category.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const createRecipe = async (formData) => {
    setIsLoading(true);
    try {
      const apiUrl = `/api/recipes${id ? `/${id}` : '/create'}`;
      const response = id
        ? await api.put(apiUrl, formData, { withCredentials: true })
        : await api.post(apiUrl, formData, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setConfirmationMessage(id ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        setShowModal(true);
      } else {
        setErrorMessage('Error submitting recipe, try again.');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setErrorMessage(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = createFormData();
    createRecipe(formData);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/home');
  };

  return (
    <form className="create-recipe-form" onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Recipe' : 'Create a Recipe'}</h2>

      {/* Error message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
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
          onChange={(e) => setIngredients([...ingredients.slice(0, -1), e.target.value])}
          onKeyDown={(e) => e.key === 'Enter' && setIngredients([...ingredients, ''])}
          placeholder="Enter ingredient"
        />

        <button
          type="button"
          className="add-ingredient-button"
          onClick={() => setIngredients([...ingredients, ''])}
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
        {/* Display existing image if no new one is selected */}
        {!imagePreview && existingImageUrl && <img src={existingImageUrl} alt="Existing" />}
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Recipe'}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{confirmationMessage}</h3>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RecipeForm;
