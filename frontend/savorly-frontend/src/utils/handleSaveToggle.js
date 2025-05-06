const handleSaveToggle = (recipe, isSaved, setSavedRecipes, setToastMessage) => {
    if (isSaved) {
      setSavedRecipes((prev) => [...prev, recipe]);
    } else {
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    }
  
    setToastMessage(isSaved ? "Recipe saved!" : "Recipe removed from saved.");
  };
  
  export default handleSaveToggle;
  