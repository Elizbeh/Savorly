import api from '../services/api';

const handleDelete = async ({
  recipeId,
  user,
  onSuccess,
  onError,
  setMessage = () => {}
}) => {
  if (!user) {
    setMessage("Please log in to delete recipes.");
    return;
  }

  if (!recipeId) {
    setMessage("Invalid recipe ID.");
    return;
  }

  try {
    const response = await api.delete(`/api/recipes/${recipeId}`);

    if (response.status === 200 || response.status === 204) {
      setMessage("Recipe deleted successfully.");
      onSuccess?.();
    } else {
      console.error("Unexpected response:", response);
      setMessage("Unexpected server response. Please try again.");
      onError?.(response);
    }
  } catch (error) {
    if (error.response?.status === 404) {
      setMessage("Recipe was already deleted or not found.");
    } else if (error.response?.status === 401) {
      setMessage("You must be logged in to delete recipes.");
    } else {
      setMessage("Failed to delete recipe. Please try again later.");
    }
    console.error("❌ Delete failed:", error);
    onError?.(error);
  }
};

export default handleDelete;
