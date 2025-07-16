import { describe, it, expect, vi, beforeEach } from 'vitest';
import handleDelete from '../../utils/handleDelete';

vi.mock('axios');

vi.mock('../../services/api', () => ({
  default: {
    delete: vi.fn()
  }
}));

import api from '../../services/api';

describe('handleDelete', () => {
  const user = { id: 'user123' };
  const recipeId = 'recipe456';

  const onSuccess = vi.fn();
  const onError = vi.fn();
  const setMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess and set success message on 200 response', async () => {
    api.delete.mockResolvedValue({ status: 200 });

    await handleDelete({ recipeId, user, onSuccess, onError, setMessage });

    expect(api.delete).toHaveBeenCalledWith(`/api/recipes/${recipeId}`);
    expect(setMessage).toHaveBeenCalledWith('Recipe deleted successfully.');
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should show login message if user is not provided', async () => {
    await handleDelete({ recipeId, user: null, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('Please log in to delete recipes.');
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('should show invalid ID message if recipeId is missing', async () => {
    await handleDelete({ recipeId: null, user, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('Invalid recipe ID.');
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('should handle 404 error correctly', async () => {
    const error = { response: { status: 404 } };
    api.delete.mockRejectedValue(error);

    await handleDelete({ recipeId, user, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('Recipe was already deleted or not found.');
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should handle 401 error correctly', async () => {
    const error = { response: { status: 401 } };
    api.delete.mockRejectedValue(error);

    await handleDelete({ recipeId, user, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('You must be logged in to delete recipes.');
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should handle unknown errors', async () => {
    const error = new Error('Server crashed');
    api.delete.mockRejectedValue(error);

    await handleDelete({ recipeId, user, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('Failed to delete recipe. Please try again later.');
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should handle unexpected non-200 response', async () => {
    const response = { status: 500 };
    api.delete.mockResolvedValue(response);

    await handleDelete({ recipeId, user, onSuccess, onError, setMessage });

    expect(setMessage).toHaveBeenCalledWith('Unexpected server response. Please try again.');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(response);
  });
});
