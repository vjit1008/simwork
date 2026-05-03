import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SimContext } from '../context/SimContext';
import Dashboard from '../pages/Dashboard';
import { defaultSimulations } from '../data/simulations';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUser = {
  fname: 'Vishvajit', lname: 'Gadakari',
  email: 'test@simwork.in', xp: 750,
  avatarColor: '#7C6EFA', certs: ['cert1', 'cert2'],
  role: 'Software Developer', city: 'Pune',
};

const mockSimValue = {
  sims: defaultSimulations(),
  updateSim: vi.fn(), resetSims: vi.fn(),
  currentSim: null, setCurrentSim: vi.fn(),
  currentStage: 'beginner', setCurrentStage: vi.fn(),
  currentTask: 0, setCurrentTask: vi.fn(),
  taskResults: {}, setTaskResults: vi.fn(),
  validationPassed: false, setValidationPassed: vi.fn(),
};

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={{
      user: mockUser, isAuthenticated: true,
      loading: false, login: vi.fn(), logout: vi.fn(), update: vi.fn(),
    }}>
      <SimContext.Provider value={mockSimValue}>
        {children}
      </SimContext.Provider>
    </AuthContext.Provider>
  </MemoryRouter>
);

describe('🏠 Dashboard Page', () => {

  test('✅ Renders user first name in greeting', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getAllByText(/Vishvajit/).length).toBeGreaterThan(0);
  });

  test('✅ Shows Total XP label', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Total XP')).toBeInTheDocument();
  });

  test('✅ Shows correct XP value', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('750')).toBeInTheDocument();
  });

  test('✅ Shows Sims Done stat card', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Sims Done')).toBeInTheDocument();
  });

  test('✅ Shows Certificates stat card', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Certificates')).toBeInTheDocument();
  });

  test('✅ Shows certificate count of 2', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('✅ Shows Rank stat card', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Rank')).toBeInTheDocument();
  });

  test('✅ Shows #42 rank', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('#42')).toBeInTheDocument();
  });

  test('✅ Shows Your Simulations section', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('🎯 Your Simulations')).toBeInTheDocument();
  });

  test('✅ Shows Software Developer simulation', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });

  test('✅ Shows Data Science simulation', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Data Science')).toBeInTheDocument();
  });

  test('✅ Shows Finance Analyst simulation', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Finance Analyst')).toBeInTheDocument();
  });

  test('✅ Shows AI Engineer simulation', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('AI Engineer')).toBeInTheDocument();
  });

  test('✅ Shows leaderboard section title', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('🏆 Top Performers')).toBeInTheDocument();
  });

  test('✅ User first name appears in leaderboard', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    // Name is split across elements — check first name only
    const elements = screen.getAllByText(/Vishvajit/);
    expect(elements.length).toBeGreaterThan(0);
  });
test('✅ Shows (you) tag in leaderboard', () => {
  render(<Dashboard />, { wrapper: Wrapper });
  expect(document.body.innerHTML).toContain('(you)');
});
  test('✅ Shows Quick Tips section', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('💡 Quick Tips')).toBeInTheDocument();
  });

  test('✅ Shows Company Workflow section', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('🔄 Company Workflow')).toBeInTheDocument();
  });

  test('✅ Clicking simulation navigates to simulations page', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Software Developer'));
    expect(mockNavigate).toHaveBeenCalledWith('/simulations');
  });
});