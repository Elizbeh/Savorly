import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App.jsx';
import '@testing-library/jest-dom';

// ✅ Mock the ProtectedRoute component
vi.mock('../../components/ProtectedRoute', () => ({
  default: ({ element }) => element,
}));

// ✅ Mock AuthContext to simulate a logged-in user
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com', role: 'user' },
    setUser: () => {},
    isLoading: false,
    logout: () => {},
  }),
}));

describe('App component routing and layout', () => {
  test('renders Navbar on the landing page ("/")', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const loginLink = await screen.findByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });

  test('does not render Navbar or Footer on /login route', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const nav = screen.queryByRole('navigation');
    expect(nav).not.toBeInTheDocument();

    const loginButton = await screen.findByRole('button', { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('renders protected HomePage when logged in', async () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );

    const welcomeText = await screen.findByText(/welcome to savorly/i);
    expect(welcomeText).toBeInTheDocument();
  });
});
