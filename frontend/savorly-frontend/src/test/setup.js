import { vi } from 'vitest';

// Global mock for useAuth
vi.mock('@contexts/AuthContext.jsx', async () => {
  const actual = await vi.importActual('@contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { name: 'Test User' },
      setUser: vi.fn(),
    }),
  };
});
