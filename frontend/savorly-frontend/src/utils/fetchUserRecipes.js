import api from '../services/api';

const fetchUserRecipes = async (setUserRecipes, setError, setToast) => {
  try {
    const response = await api.get('/api/recipes/user', { withCredentials: true });
    setUserRecipes(response.data);
    setError(null);
  } catch (err) {
    console.error('Failed to fetch user recipes:', err);
    setError('Unable to load your recipes.');
    setToast('Failed to load your recipes. Please try again later.');
  }
};

export default fetchUserRecipes;