import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../components/Register"; // Adjust the path if necessary
import { BrowserRouter as Router } from "react-router-dom";

// Mock fetch for testing the submit functionality
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Registration successful!" }),
  })
);

describe("Register Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  it("renders the register form correctly", () => {
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  /*it("shows an error message for empty required fields", async () => {
    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
  });

 /* it("shows an error message for invalid email format", async () => {
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  /*it("shows an error message for weak password", async () => {
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "weak" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
  
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    }, { timeout: 3000 }); // Increased timeout
  });*/
  

  it("shows a success message on successful registration", async () => {
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  /*it("redirects to the login page after successful registration", async () => {
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Check if fetch is called once
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });*/
});
