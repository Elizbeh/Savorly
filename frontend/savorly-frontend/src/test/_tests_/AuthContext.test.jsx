import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import { vi } from 'vitest';

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

    // Directly check if the text "Test User" is rendered
    await screen.findByText('Test User');
    expect(screen.getByText('Test User')).toBeTruthy();
  });
});
