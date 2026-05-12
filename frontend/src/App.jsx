import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimProvider } from './context/SimContext';
import Topbar      from './components/Navbar/Topbar';
import Sidebar     from './components/Sidebar/Sidebar';
import Toast       from './components/Toast';
import Landing     from './pages/Landing';  
import Auth        from './pages/Auth';
import Dashboard   from './pages/Dashboard';
import Simulations from './pages/Simulations';
import Profile     from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Settings    from './pages/Settings';
import IDEPage     from './components/IDE/IDEPage';
import './styles/global.css';
import Projects  from './pages/Projects';
import Teamwork  from './pages/Teamwork';


const BREADCRUMBS = {
  '/':            'Dashboard',
  '/simulations': 'Simulations',
  '/profile':     'My Profile',
  '/leaderboard': 'Leaderboard',
  '/settings':    'Settings',
  '/ide':         'IDE & Tasks',
};

function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('simwork_theme') || 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('simwork_theme', theme);
  }, [theme]);

  const closeSidebar = () => setSidebarCollapsed(true);

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      color: 'var(--muted)', fontSize: 16, height: '100vh'
    }}>
      Loading...
    </div>
  );

 if (!isAuthenticated) {
  return (
    <Routes>
      <Route path="/"     element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*"     element={<Navigate to="/" replace />} />
  
<Route path="/projects"  element={<Projects />} />
<Route path="/teamwork"  element={<Teamwork />} />
    </Routes>
  );
}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar
        onToggleSidebar={() => setSidebarCollapsed(p => !p)}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        theme={theme}
        breadcrumb={BREADCRUMBS[location.pathname] || 'SimWork'}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onClose={closeSidebar}
        />

        {/* Mobile backdrop — tap anywhere to close sidebar */}
        {!sidebarCollapsed && (
          <div
            onClick={closeSidebar}
            className="mob-backdrop"
            style={{
              position: 'fixed', inset: 0, zIndex: 97,
              background: 'rgba(0,0,0,0.5)',
              display: 'none',  // shown via CSS on mobile only
            }}
          />
        )}

        {/* Main content — tap also closes sidebar on mobile */}
        <div
          style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onClick={() => { if (window.innerWidth <= 768) closeSidebar(); }}
        >
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings"    element={<Settings />} />
            <Route path="/ide"         element={<IDEPage />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SimProvider>
          <AppLayout />
          <Toast />
        </SimProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}