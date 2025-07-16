import { describe, it, expect, vi, beforeEach } from "vitest";
import handleSaveToggle from "../../utils/handleSaveToggle";
import api from "../../services/api";

// Mock the `api.post` method
vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn()
  }
}));

describe("handleSaveToggle", () => {
  const recipeId = "abc123";
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call onSuccess with data when toggle is successful", async () => {
    const mockResponseData = { saved: true };

    api.post.mockResolvedValueOnce({ data: mockResponseData });

    await handleSaveToggle(recipeId, mockOnSuccess, mockOnError);

    expect(api.post).toHaveBeenCalledWith("/api/saved-recipes/toggle-save", { recipeId });
    expect(mockOnSuccess).toHaveBeenCalledWith(mockResponseData);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it("should call onError with message when API call fails with message", async () => {
    const errorMessage = "Unauthorized";
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    await handleSaveToggle(recipeId, mockOnSuccess, mockOnError);

    expect(mockOnError).toHaveBeenCalledWith(errorMessage);
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should call onError with fallback message if no error message is provided", async () => {
    api.post.mockRejectedValueOnce(new Error("Network error"));

    await handleSaveToggle(recipeId, mockOnSuccess, mockOnError);

    expect(mockOnError).toHaveBeenCalledWith("Something went wrong");
  });

  it("should call onError with 'Missing recipeId' if recipeId is missing", async () => {
    await handleSaveToggle(undefined, mockOnSuccess, mockOnError);

    expect(mockOnError).toHaveBeenCalledWith("Missing recipeId");
    expect(api.post).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
