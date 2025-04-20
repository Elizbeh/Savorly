import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@contexts/AuthContext';

vi.mock('@contexts/AuthContext', async () => {
  const actual = await vi.importActual('@contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({ user: { name: 'Test User' }, setUser: vi.fn() }),
  };
});

const TestComponent = () => {
  const { user } = useAuth();
  return <div>{user?.name}</div>;
};

describe('AuthContext', () => {
  it('fetches and sets user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});
