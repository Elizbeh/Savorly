// src/test/_tests_/App.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App.jsx';
import '@testing-library/jest-dom';

// ✅ Mock useAuth from AuthContext directly
vi.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com', role: 'user' },
    setUser: () => {},
    isLoading: false,
    logout: () => {},
  }),
}));

describe('App component routing and layout', () => {
  test('renders Navbar on the landing page ("/")', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });

  test('does not render Navbar or Footer on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const nav = screen.queryByRole('navigation');
    expect(nav).not.toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: /log in/i }); // ✅ fixed name
    expect(loginButton).toBeInTheDocument();
  });

  test('renders protected HomePage when logged in', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <App />
    </MemoryRouter>
  );

  const welcomeText = screen.getByText(/welcome to savorly/i);
  expect(welcomeText).toBeInTheDocument();
});

});
