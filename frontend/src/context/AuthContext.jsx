import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { showToast } from '../components/Toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved  = localStorage.getItem('simwork_user_v3');

    if (!token) { setLoading(false); return; }

    if (saved) {
      try {
    const parsed = JSON.parse(saved);
    // If stale cache is missing profile fields, don't use it
    if (parsed.name && parsed.email) {
      setUser(parsed);
    }
  } catch (e) {}
    }

    // ✅ Fixed URL: /api/users/me (was /api/user/me)
    API.get('/api/users/me')
      .then(({ data }) => {
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('simwork_user_v3', JSON.stringify(data.user));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('simwork_user_v3', JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Fixed: update() now only updates local state.
  //    Settings.jsx already handles the API call itself —
  //    calling API.put a second time here caused the double-save + error toast.
  const update = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('simwork_user_v3', JSON.stringify(userData));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('simwork_user_v3');
      localStorage.removeItem('simwork_sims_v3');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, update, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};