// src/test/setup.js
import { vi } from 'vitest';

vi.mock('@contexts/AuthContext', async () => {
  const actual = await vi.importActual('@contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'user' },
      setUser: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    }),
  };
});
