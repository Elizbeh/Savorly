export const updateRecipe = async (id, updatedData) => {
  const formData = new FormData();
  formData.append('title', updatedData.title);
  formData.append('description', updatedData.description);

  if (updatedData.image) {
    formData.append('image', updatedData.image);
  }

  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',  // Required for sending cookies
    });

    if (response.ok) {
      console.log('Recipe updated successfully');
    } else {
      const error = await response.json();
      console.error('Error updating recipe:', error.message);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include',  // Required for sending cookies
    });

    if (response.ok) {
      console.log('Recipe deleted successfully');
    } else {
      const error = await response.json();
      console.error('Error deleting recipe:', error.message);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
  }
};
