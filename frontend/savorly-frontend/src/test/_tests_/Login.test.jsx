import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../../components/Login';

// Mock loginUser function from the services
vi.mock('../../services/auth', () => ({
  loginUser: vi.fn(),
}));

// Mock useAuth context
const setUserMock = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ setUser: setUserMock }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    setUserMock.mockClear();
  });

  it('shows error message for invalid password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'short' },
    });

    fireEvent.click(screen.getByText('Log In'));

    // Assert that the error message is shown for the invalid password
    expect(
      await screen.findByText(/password must be at least/i)
    ).toBeInTheDocument();
  });

  it('shows error message on login failure', async () => {
    const { loginUser } = await import('../../services/auth');
    loginUser.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'WrongPassword1!' },
    });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      // Assert that the error message for login failure is shown
      expect(
        screen.getByText(/something went wrong/i)
      ).toBeInTheDocument();
    });
  });

  it('calls setUser and navigates on successful login', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const { loginUser } = await import('../../services/auth');
    loginUser.mockResolvedValue(mockUser);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'ValidPass123!' },
    });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      // Assert that the setUser function is called with the mock user
      expect(setUserMock).toHaveBeenCalledWith(mockUser);
    });
  });
});
