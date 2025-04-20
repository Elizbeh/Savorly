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

  /*it('shows error message for invalid email', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
    const emailInput = screen.getByPlaceholderText(/email/i); // Get the email input by placeholder text
    const passwordInput = screen.getByPlaceholderText(/password/i); // Get the password input
    const loginButton = screen.getByRole("button", { name: /log in/i }); // Get the login button
  
    // Fill in the fields with invalid email
    fireEvent.change(emailInput, { target: { value: "invalidemail.com" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPass123!" } });
  
    // Submit the form
    fireEvent.click(loginButton);
  
    // Log the container to check if the error is rendered
    await waitFor(() => {
      expect(screen.getByText((content, element) => 
        content.includes("invalid email format") && element.tagName.toLowerCase() === "p")).toBeInTheDocument();
    });    
  });
  */

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
      expect(setUserMock).toHaveBeenCalledWith(mockUser);
    });
  });
});
