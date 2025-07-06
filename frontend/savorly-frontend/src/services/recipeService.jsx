// services/recipeService.js
import api from './api';

export const updateRecipe = async (id, updatedData) => {
  const formData = new FormData();
  formData.append('title', updatedData.title);
  formData.append('description', updatedData.description);

  if (updatedData.image) {
    formData.append('image', updatedData.image);
  }

  try {
    const response = await api.put(`/api/recipes/${id}`)

    if (response.ok) {
      console.log('Recipe updated successfully');
      return { status: 200 };
    } else {
      const error = await response.json();
      console.error('Error updating recipe:', error.message);
      return { status: response.status, message: error.message };
    }
  } catch (err) {
    console.error('Request failed:', err.message);
    return { status: 500, message: 'Request failed' };
  }
};


export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/api/recipes/${id}`);

    if (response.status === 200) {
      console.log('Recipe deleted successfully');
      return { status: 200 };
    } else {
      console.error('Error deleting recipe:', response.data.message);
      return { status: response.status, message: response.data.message };
    }
  } catch (err) {
    console.error('Request failed:', err.message);
    return { status: 500, message: 'Request failed' };
  }
};

