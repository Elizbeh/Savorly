import { loginUser } from '../../services/auth.js';
import api from '../../services/api.jsx';

vi.mock('../../services/api');


describe('loginUser', () => {
  const mockUser = { name: 'Test User', email: 'test@example.com' };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('logs in user when server returns user data', async () => {
    api.post.mockResolvedValue({
      status: 200,
      data: { user: mockUser }
    });

    const result = await loginUser({ email: 'test@example.com', password: 'StrongPass1!' });

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'StrongPass1!',
    });

    expect(result).toEqual(mockUser);
  });

  it('throws error if user is missing from response', async () => {
    api.post.mockResolvedValue({
      status: 200,
      data: {} // No user returned
    });

    await expect(
      loginUser({ email: 'test@example.com', password: 'StrongPass1!' })
    ).rejects.toThrow('User not returned from login response');
  });
});