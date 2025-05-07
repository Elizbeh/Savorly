import api from '../services/api';

const fetchData = async (setRecipes, setCategories, setRecipesError, setCategoriesError, setToastMessage) => {
  try {
        const [recipeResponse, categoryResponse] = await Promise.all([
          api.get("/api/recipes", { withCredentials: "true" }),
          api.get("/api/categories", { withCredentials: "true" }),
        ]);
        
    setRecipes(recipeResponse.data);
    setCategories(categoryResponse.data);
    setRecipesError(null);
    setCategoriesError(null);
  } catch (error) {
    console.error("API Error:", error);
    setRecipesError("Unable to load recipes. Please try again.");
    setCategoriesError("Unable to load categories. Please try again.");
    setToastMessage("Failed to load data. Please try again later.");
  }
};

export default fetchData;
