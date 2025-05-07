import { loginUser } from '../../services/auth';
import api from '../../services/api';
import Cookies from 'js-cookie';

vi.mock('../../services/api');
vi.mock('js-cookie');

describe('loginUser', () => {
  const mockUser = { name: 'Test User', email: 'test@example.com' };
  const mockToken = 'fake-token';

  afterEach(() => {
    vi.clearAllMocks(); // Clear all mocks after each test
  });

  it('logs in user and sets token cookie', async () => {
    // Mocking API response
    api.post.mockResolvedValue({
      status: 200,
      data: { token: mockToken, user: mockUser },
    });

    // Call the loginUser function
    const result = await loginUser({ email: 'test@example.com', password: 'StrongPass1!' });

    // Assertions
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'StrongPass1!',
    });
    expect(Cookies.set).toHaveBeenCalledWith('authToken', mockToken, expect.any(Object));
    expect(result).toEqual(mockUser);
  });

  it('throws error if token is missing', async () => {
    // Mocking API response without token
    api.post.mockResolvedValue({
      status: 200,
      data: { user: mockUser },
    });

    // Expecting the loginUser function to throw an error
    await expect(
      loginUser({ email: 'test@example.com', password: 'StrongPass1!' })
    ).rejects.toThrow('Token missing in response');
  });
});
