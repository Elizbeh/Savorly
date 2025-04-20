import { vi } from "vitest"; // Import Vitest mocking functions
import api from "../../services/api"; // Import the API module
import handleDelete from "../../utils/handleDelete"; // Import the function to test

vi.mock("../../services/api"); // Mock the API module

describe("handleDelete", () => {
  // Mocking setState functions
  const mockSetRecipes = vi.fn();
  const mockSetToastMessage = vi.fn();

  const user = { token: "mocked-token" }; // Mocked user for testing

  beforeEach(() => {
    mockSetRecipes.mockClear(); // Clear previous calls before each test
    mockSetToastMessage.mockClear(); // Clear previous calls before each test
  });

  it("should show an error message if user is not logged in", async () => {
    // Call handleDelete with no user (user is null)
    await handleDelete(null, null, mockSetRecipes, mockSetToastMessage);

    // Verify that the toast message was set for not being logged in
    expect(mockSetToastMessage).toHaveBeenCalledWith("Please log in to delete recipes.");
  });

  it("should delete the recipe and update the recipes list on success", async () => {
    const recipeId = 1; // Example recipeId
    const recipesBefore = [{ id: 1, name: "Recipe 1" }, { id: 2, name: "Recipe 2" }];
    const recipesAfter = [{ id: 2, name: "Recipe 2" }];

    // Mock the successful API delete response
    api.delete.mockResolvedValueOnce({});

    // Call handleDelete with the user and mocked setRecipes
    await handleDelete(recipeId, user, mockSetRecipes, mockSetToastMessage);

    // Check if the recipe was deleted from the recipes list
    expect(mockSetRecipes).toHaveBeenCalledWith(expect.any(Function));

    // The update function passed to setRecipes should filter out the deleted recipe
    const setRecipesCallback = mockSetRecipes.mock.calls[0][0];
    expect(setRecipesCallback(recipesBefore)).toEqual(recipesAfter);

    // Ensure that no toast message was shown for errors
    expect(mockSetToastMessage).not.toHaveBeenCalled();
  });

  it("should show an error message if the API call fails", async () => {
    const recipeId = 1;

    // Mock the API delete call to fail
    api.delete.mockRejectedValueOnce(new Error("Failed to delete"));

    // Call handleDelete with the user
    await handleDelete(recipeId, user, mockSetRecipes, mockSetToastMessage);

    // Verify that the error toast message is shown
    expect(mockSetToastMessage).toHaveBeenCalledWith("Failed to delete recipe. Please try again later.");
  });
});
