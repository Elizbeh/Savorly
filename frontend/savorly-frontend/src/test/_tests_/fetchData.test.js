import fetchData from "../../utils/fetchData";
import api from "../../services/api";

vi.mock("../../services/api"); // Mock API module

describe("fetchData", () => {
  it("fetches and sets recipes and categories on success", async () => {
    // Mocking the state setter functions
    const mockSetRecipes = vi.fn();
    const mockSetCategories = vi.fn();
    const mockSetRecipesError = vi.fn();
    const mockSetCategoriesError = vi.fn();
    const mockSetToastMessage = vi.fn();

    // Mock successful API response
    api.get.mockResolvedValueOnce({ data: ["recipe1", "recipe2"] });
    api.get.mockResolvedValueOnce({ data: ["category1", "category2"] });

    // Calling the function
    await fetchData(
      mockSetRecipes,
      mockSetCategories,
      mockSetRecipesError,
      mockSetCategoriesError,
      mockSetToastMessage
    );

    // Verifying the state setter functions were called with the correct values
    expect(mockSetRecipes).toHaveBeenCalledWith(["recipe1", "recipe2"]);
    expect(mockSetCategories).toHaveBeenCalledWith(["category1", "category2"]);
    expect(mockSetRecipesError).toHaveBeenCalledWith(null);
    expect(mockSetCategoriesError).toHaveBeenCalledWith(null);
  });

  it("sets errors when API calls fail", async () => {
    // Mocking the state setter functions
    const mockSetRecipes = vi.fn();
    const mockSetCategories = vi.fn();
    const mockSetRecipesError = vi.fn();
    const mockSetCategoriesError = vi.fn();
    const mockSetToastMessage = vi.fn();

    // Mocking the API call to reject with an error
    api.get.mockRejectedValueOnce(new Error("API error"));

    // Calling the function
    await fetchData(
      mockSetRecipes,
      mockSetCategories,
      mockSetRecipesError,
      mockSetCategoriesError,
      mockSetToastMessage
    );

    // Verifying that the error handling worked as expected
    expect(mockSetRecipesError).toHaveBeenCalledWith("Unable to load recipes. Please try again.");
    expect(mockSetCategoriesError).toHaveBeenCalledWith("Unable to load categories. Please try again.");
    expect(mockSetToastMessage).toHaveBeenCalledWith("Failed to load data. Please try again later.");
  });
});
