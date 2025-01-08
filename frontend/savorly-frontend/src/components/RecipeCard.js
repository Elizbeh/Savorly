const RecipeCard = ({ recipe }) => {
    return (
      <div className="recipe-card">
        <img src={recipe.imageUrl} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <button>View Recipe</button>
      </div>
    );
  };
  
  export default RecipeCard;
  