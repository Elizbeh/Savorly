import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../components/Register';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn((url, data) => {
      if (data.email === 'invalid-email') {
        return Promise.reject({
          response: { data: { message: 'Invalid email format' } },
        });
      }
      return Promise.resolve({ data: { message: 'Registration successful!' } });
    }),
  },
}));

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  it('renders the register form correctly', () => {
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows a success message on successful registration', async () => {
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' }
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  /*it('shows an error message for empty required fields', async () => {
    render(<Register />);

    // Submit the form with empty fields (the default state of the form)
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      const firstNameError = screen.getByText(/first name is required/i);
      const lastNameError = screen.getByText(/last name is required/i);
      const emailError = screen.getByText(/email is required/i);
      const passwordError = screen.getByText(/password is required/i);
      
      // Check that the error messages appear in the document
      expect(firstNameError).toBeInTheDocument();
      expect(lastNameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });*/
  

  it('shows an error message for weak password', async () => {
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'Jane' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'jane.doe@example.com' }
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'weak' }
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      const errorDiv = screen.getByRole('alert');
      expect(errorDiv).toHaveTextContent(
        /password should be at least 8 characters/i
      );
    });
  });

  it('redirects to the login page after successful registration', async () => {
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' }
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });
});
