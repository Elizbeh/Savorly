import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RecipeFormPage.css';
import api from '../services/api';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    calories: '',
    servings: '',
    difficulty: 'Medium'
  });

  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load categories');
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch existing recipe if editing
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/api/recipes/${id}`);
          const data = response.data;

          setFormData({
            title: data.title || '',
            description: data.description || '',
            prepTime: data.prep_time || '',
            cookTime: data.cook_time || '',
            calories: data.calories || '',
            servings: data.servings || '',
            difficulty: data.difficulty || 'Medium'
          });

          setIngredients(data.ingredients?.split('\n') || ['']);
          setInstructions(data.instructions?.split('\n') || ['']);
          setSelectedCategories(data.categories?.map(c => c.id) || []);
          setExistingImageUrl(data.image_url);
          if (data.image_url) setImagePreview(data.image_url);
        } catch (error) {
          console.error('Error fetching recipe:', error);
          setError('Failed to load recipe');
        }
      };
      fetchRecipe();
    }
  }, [id]);

  // Auto-dismiss messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, array, setArray) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayItem = (array, setArray) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (index, array, setArray) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return false;
    }
    if (formData.description.trim().length < 20) {
      setError('Description must be at least 20 characters');
      return false;
    }
    if (!formData.prepTime || formData.prepTime <= 0) {
      setError('Please enter a valid prep time');
      return false;
    }
    if (!formData.cookTime || formData.cookTime <= 0) {
      setError('Please enter a valid cook time');
      return false;
    }
    const filledIngredients = ingredients.filter(i => i.trim());
    if (filledIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return false;
    }
    const filledInstructions = instructions.filter(i => i.trim());
    if (filledInstructions.length === 0) {
      setError('Please add at least one instruction');
      return false;
    }
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      if (id) data.append('id', id);

      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      ingredients.filter(i => i.trim()).forEach(i => data.append('ingredients[]', i));
      instructions.filter(i => i.trim()).forEach(i => data.append('instructions[]', i));
      selectedCategories.forEach(c => data.append('categories[]', c));

      if (image) data.append('image', image);

      const apiUrl = id ? `/api/recipes/${id}` : '/api/recipes/create';
      const method = id ? 'put' : 'post';

      const response = await api[method](apiUrl, data, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setSuccess(id ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-container">
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16 10H4m6-6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1>{id ? 'Edit Recipe' : 'Create New Recipe'}</h1>
          <p>Share your culinary creation with the community</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l7.59-7.59L18 6l-9 9z" fill="currentColor"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Image Upload */}
          <div className="form-section image-section">
            <label className="image-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {imagePreview || existingImageUrl ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview || existingImageUrl} alt="Recipe preview" className="image-preview" />
                  <div className="image-overlay">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm12-4h-4.59l-2.7-2.7A2 2 0 0019 1H13a2 2 0 00-1.41.59L9 4H4C2.9 4 2 4.9 2 6v20c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-12 22c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z" fill="currentColor"/>
                    </svg>
                    <span>Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 14c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm18-6H34.59l-3.6-3.6A3 3 0 0028.83 3H19.17a3 3 0 00-2.16.9L13.41 8H6C4.34 8 3 9.34 3 11v30c0 1.66 1.34 3 3 3h36c1.66 0 3-1.34 3-3V11c0-1.66-1.34-3-3-3zm-18 33c-8.28 0-15-6.72-15-15s6.72-15 15-15 15 6.72 15 15-6.72 15-15 15z" fill="currentColor"/>
                  </svg>
                  <p>Upload Recipe Photo</p>
                  <span>Click to browse (Max 5MB)</span>
                </div>
              )}
            </label>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Spaghetti Carbonara"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prepTime">Prep Time (min) *</label>
                <input
                  id="prepTime"
                  name="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="15"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cookTime">Cook Time (min) *</label>
                <input
                  id="cookTime"
                  name="cookTime"
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  placeholder="30"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="servings">Servings *</label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={handleInputChange}
                  placeholder="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="calories">Calories (kcal)</label>
                <input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="450"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-section">
            <h2 className="section-title">Ingredients</h2>
            <div className="array-items">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayChange(index, e.target.value, ingredients, setIngredients)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeArrayItem(index, ingredients, setIngredients)}
                      title="Remove"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem(ingredients, setIngredients)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-section">
            <h2 className="section-title">Instructions</h2>
            <div className="array-items">
              {instructions.map((instruction, index) => (
                <div key={index} className="array-item numbered">
                  <span className="item-number">{index + 1}</span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange(index, e.target.value, instructions, setInstructions)}
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeArrayItem(index, instructions, setInstructions)}
                      title="Remove"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem(instructions, setInstructions)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Step
            </button>
          </div>

          {/* Categories */}
          <div className="form-section">
            <h2 className="section-title">Categories</h2>
            {loadingCategories ? (
              <p className="loading-text">Loading categories...</p>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <label key={category.id} className="category-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category.id));
                        }
                      }}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="category-name">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="25"/>
                  </svg>
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM5 4h10v8H5V4zm0 12v-2h10v2H5z" fill="currentColor"/>
                  </svg>
                  {id ? 'Update Recipe' : 'Publish Recipe'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;