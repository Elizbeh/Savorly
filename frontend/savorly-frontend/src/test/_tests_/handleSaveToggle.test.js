import { vi } from "vitest"; // Import Vitest mocking functions
import handleSaveToggle from "../../utils/handleSaveToggle"; // Import the function to test

describe("handleSaveToggle", () => {
  const mockSetSavedRecipes = vi.fn();
  const mockSetToastMessage = vi.fn();

  const recipe = { id: 1, name: "Recipe 1" };

  beforeEach(() => {
    mockSetSavedRecipes.mockClear(); // Clear previous calls before each test
    mockSetToastMessage.mockClear(); // Clear previous calls before each test
  });

  it("should add recipe to saved list and show 'Recipe saved!' when isSaved is true", () => {
    const isSaved = true;

    // Call handleSaveToggle with isSaved = true
    handleSaveToggle(recipe, isSaved, mockSetSavedRecipes, mockSetToastMessage);

    // Ensure that setSavedRecipes is called with the new saved recipe
    expect(mockSetSavedRecipes).toHaveBeenCalledWith(expect.any(Function));

    // Check that the function passed to setSavedRecipes adds the recipe to the saved list
    const setSavedRecipesCallback = mockSetSavedRecipes.mock.calls[0][0];
    expect(setSavedRecipesCallback([])).toEqual([recipe]); // Assuming the previous saved list is empty

    // Ensure the toast message is set to "Recipe saved!"
    expect(mockSetToastMessage).toHaveBeenCalledWith("Recipe saved!");
  });

  it("should remove recipe from saved list and show 'Recipe removed from saved.' when isSaved is false", () => {
    const isSaved = false;
    const savedRecipesBefore = [{ id: 1, name: "Recipe 1" }, { id: 2, name: "Recipe 2" }];
    const savedRecipesAfter = [{ id: 2, name: "Recipe 2" }];

    // Call handleSaveToggle with isSaved = false
    handleSaveToggle(recipe, isSaved, mockSetSavedRecipes, mockSetToastMessage);

    // Ensure that setSavedRecipes is called with the updated saved list (excluding the removed recipe)
    expect(mockSetSavedRecipes).toHaveBeenCalledWith(expect.any(Function));

    // Check that the function passed to setSavedRecipes filters out the removed recipe
    const setSavedRecipesCallback = mockSetSavedRecipes.mock.calls[0][0];
    expect(setSavedRecipesCallback(savedRecipesBefore)).toEqual(savedRecipesAfter);

    // Ensure the toast message is set to "Recipe removed from saved."
    expect(mockSetToastMessage).toHaveBeenCalledWith("Recipe removed from saved.");
  });
});
