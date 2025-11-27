import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  profile: {
    get: jest.fn(),
  },
}));

jest.mock('@/components/Alert', () => {
  return function MockAlert({ children, type }) {
    return <div data-testid={`alert-${type}`}>{children}</div>;
  };
});

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      login: mockLogin,
    });
    
    // Mock useRouter via the jest.setup.js mock, but we can spy on it if needed
    // Since we mocked next/navigation in setup, we can't easily access the spy instance unless we import it
    // But for now let's rely on the fact that we mocked it globally.
    // Actually, to verify calls, we should probably mock it locally or spy on the global mock.
    // Let's just assume the global mock works and we can't easily assert on it without importing it.
    // Wait, I can re-mock next/navigation here if I want to assert.
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form with credentials', async () => {
    mockLogin.mockResolvedValue({ error: null });
    api.profile.get.mockResolvedValue({ data: { profile: { name: 'Test User' } } });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message on login failure', async () => {
    mockLogin.mockResolvedValue({ error: { message: 'Invalid credentials' } });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId('alert-error')).toHaveTextContent('Invalid credentials');
    });
  });
});
