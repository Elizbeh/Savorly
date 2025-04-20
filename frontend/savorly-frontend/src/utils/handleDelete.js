import api from '../services/api';

const handleDelete = async (recipeId, user, setRecipes, setToastMessage) => {
  if (!user) return setToastMessage("Please log in to delete recipes.");

  try {
    await api.delete(`/recipes/${recipeId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  } catch (error) {
    console.error("Error deleting recipe:", error);
    setToastMessage("Failed to delete recipe. Please try again later.");
  }
};

export default handleDelete;
