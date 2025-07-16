import api from '../services/api';

/**
 * Toggles the save status of a recipe (save or unsave)
 *  @param {string} userId
 * @param {string} recipeId - ID of the recipe to toggle
 * @param {boolean} isCurrentlySaved - Whether it's currently saved
 * @param {function} onSuccess - Callback when successful
 * @param {function} onError - Callback when failed
 */
const handleSaveToggle = async (recipeId, onSuccess, onError) => {
  if (!recipeId) {
    onError?.('Missing recipeId');
    return;
  }

  try {
    const response = await api.post('/api/saved-recipes/toggle-save', { recipeId });
    onSuccess?.(response.data);
  } catch (error) {
    onError?.(error.response?.data?.message || 'Something went wrong');
  }
};


export default handleSaveToggle;
