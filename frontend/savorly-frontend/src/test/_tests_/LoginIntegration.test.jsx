import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/Login";  // Path to your Login component
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";  // Wrap your component in Router
import { useAuth } from "../../contexts/AuthContext"; // Custom hook for context
import { loginUser } from "../../services/auth"; // Service for login
import Cookies from "js-cookie"; // For mocking cookies

// Mock the loginUser function to avoid actual API calls
vi.mock("../../services/auth", () => ({
  loginUser: vi.fn(),
}));

// Mock the useAuth hook
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock Cookies.set to track if the auth token is set correctly
vi.mock("js-cookie", () => ({
  set: vi.fn(),
  get: vi.fn(),
}));


describe("Login Component", () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      setUser: mockSetUser,
    });
    vi.clearAllMocks();  // Reset mocks before each test
  });

  it("should render the login form correctly", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  it("should show an error message for invalid email format", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
  
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid123!" },
    });
  
    fireEvent.click(screen.getByText("Log In"));
  
    expect(
      await screen.findByText((content, element) =>
        element?.tagName.toLowerCase() === "p" &&
        content.includes("Invalid email format")
      )
    ).toBeInTheDocument();
  });
   

  it("should show an error message for invalid password format", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "valid@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByText("Log In"));

    await waitFor(() =>
      expect(
        screen.getByText(
          "Password must be at least 8 characters long and contain a letter, a number, and a special character"
        )
      ).toBeInTheDocument()
    );
  });

  

  it("should display an error message when login fails", async () => {
    // Mock a failed login response
    loginUser.mockRejectedValueOnce(new Error("Something went wrong"));

    render(
      <Router>
        <Login />
      </Router>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "valid@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Valid123!" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Log In"));

    // Wait for the error message
    await waitFor(() =>
      expect(screen.getByText("Something went wrong. Please try again later.")).toBeInTheDocument()
    );
  });
});
