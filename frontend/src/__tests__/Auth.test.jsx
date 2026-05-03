import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SimContext } from '../context/SimContext';
import Auth from '../pages/Auth';
import { defaultSimulations } from '../data/simulations';
import { vi } from 'vitest';

const mockLogin    = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockAuthValue = {
  user: null, isAuthenticated: false, loading: false,
  login: mockLogin, logout: vi.fn(), update: vi.fn(),
};

const mockSimValue = {
  sims: defaultSimulations(), updateSim: vi.fn(), resetSims: vi.fn(),
  currentSim: null, setCurrentSim: vi.fn(),
  currentStage: 'beginner', setCurrentStage: vi.fn(),
  currentTask: 0, setCurrentTask: vi.fn(),
  taskResults: {}, setTaskResults: vi.fn(),
  validationPassed: false, setValidationPassed: vi.fn(),
};

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthValue}>
      <SimContext.Provider value={mockSimValue}>
        {children}
      </SimContext.Provider>
    </AuthContext.Provider>
  </MemoryRouter>
);

// ✅ Helper: click the TAB (first Sign Up element = the tab button)
const clickSignUpTab = () => {
  const allSignUp = screen.getAllByText('Sign Up');
  fireEvent.click(allSignUp[0]); // First one is always the tab
};

// ✅ Helper: click the Sign In TAB
const clickSignInTab = () => {
  const allSignIn = screen.getAllByText('Sign In');
  fireEvent.click(allSignIn[0]); // First one is always the tab
};

describe('🔐 Auth Page', () => {

  beforeEach(() => {
    mockLogin.mockClear();
    mockNavigate.mockClear();
  });

  test('✅ Renders login form by default', () => {
    render(<Auth />, { wrapper: Wrapper });
    expect(screen.getByText('Welcome back 👋')).toBeInTheDocument();
  });

  test('✅ Shows Sign In and Sign Up tabs', () => {
    render(<Auth />, { wrapper: Wrapper });
    // Use getAllByText since Sign Up appears in tab + link
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
  });

  test('✅ Has email and password inputs on login form', () => {
    render(<Auth />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
  });

  test('✅ Has Sign In button', () => {
    render(<Auth />, { wrapper: Wrapper });
    expect(screen.getByText('Sign In →')).toBeInTheDocument();
  });

  test('✅ Has Demo Account button', () => {
    render(<Auth />, { wrapper: Wrapper });
    expect(screen.getByText('🚀 Try Demo Account')).toBeInTheDocument();
  });

  test('✅ Switches to signup form when tab clicked', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByText('Create account ✨')).toBeInTheDocument();
  });

  test('✅ Signup form has first name field', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByPlaceholderText('First')).toBeInTheDocument();
  });

  test('✅ Signup form has last name field', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByPlaceholderText('Last')).toBeInTheDocument();
  });

  test('✅ Signup form has password field', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByPlaceholderText('Min. 6 characters')).toBeInTheDocument();
  });

  test('✅ Shows error on empty login submit', async () => {
    render(<Auth />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Sign In →'));
    await waitFor(() => {
      expect(screen.getByText('Please fill all fields')).toBeInTheDocument();
    });
  });

  test('✅ Shows error for wrong credentials', async () => {
    render(<Auth />, { wrapper: Wrapper });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'),
      { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your password'),
      { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Sign In →'));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  test('✅ Demo login calls login function', async () => {
    render(<Auth />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('🚀 Try Demo Account'));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  test('✅ Signup shows error for missing required fields', async () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    fireEvent.click(screen.getByText('Create Account →'));
    await waitFor(() => {
      expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
    });
  });

 test('✅ Signup shows error for short password', async () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    fireEvent.change(screen.getByPlaceholderText('First'),
      { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Last'),
      { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'),
      { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'),
      { target: { value: '123' } });
    fireEvent.click(screen.getByText('Create Account →'));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  // In Auth.test.jsx, update the "missing role" test:

test('✅ Signup shows error for missing role', async () => {
  render(<Auth />, { wrapper: Wrapper });
  clickSignUpTab();
  fireEvent.change(screen.getByPlaceholderText('First'),
    { target: { value: 'Test' } });
  fireEvent.change(screen.getByPlaceholderText('Last'),
    { target: { value: 'User' } });
  fireEvent.change(screen.getByPlaceholderText('you@example.com'),
    { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'),
    { target: { value: 'password123' } });
  fireEvent.change(screen.getByPlaceholderText('Pune'),   // ← ADD THIS
    { target: { value: 'Mumbai' } });
  // role left empty — select stays at "Select..."
  fireEvent.click(screen.getByText('Create Account →'));
  await waitFor(() => {
    expect(screen.getByText('Please select a target role')).toBeInTheDocument();
  });
});

  test('✅ Signup form has city field', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByPlaceholderText('Pune')).toBeInTheDocument();
  });


test('✅ Signup form has role selector', () => {
  render(<Auth />, { wrapper: Wrapper });
  clickSignUpTab();
  // Two selects render with "Select..." — use getAllByText
  const selects = screen.getAllByText('Select...');
  expect(selects.length).toBeGreaterThan(0);
});

  test('✅ Signup form shows all role options', () => {
    render(<Auth />, { wrapper: Wrapper });
    clickSignUpTab();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Data Scientist')).toBeInTheDocument();
    expect(screen.getByText('Finance Analyst')).toBeInTheDocument();
    expect(screen.getByText('AI Engineer')).toBeInTheDocument();
  });

});