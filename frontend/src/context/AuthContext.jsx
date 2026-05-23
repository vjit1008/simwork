import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { showToast } from '../components/Toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    // Seed from cache immediately so UI isn't blank
    const saved = localStorage.getItem('simwork_user_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed?.email) setUser(parsed);
      } catch (_) {}
    }

    // Always re-fetch full profile from DB on app load
    // This ensures XP, certs, education, city, role are up-to-date
    API.get('/api/users/me')
      .then(({ data }) => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('simwork_user_v3', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // token expired or network error — clear bad token
        const cached = localStorage.getItem('simwork_user_v3');
        if (!cached) {
          localStorage.removeItem('token');
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('simwork_user_v3', JSON.stringify(userData));
    setUser(userData);

    // After login, fetch full profile from DB to get all fields
    // (login endpoint may return minimal user object)
    if (token) {
      API.get('/api/users/me')
        .then(({ data }) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('simwork_user_v3', JSON.stringify(data.user));
          }
        })
        .catch(() => {}); // silent — we already have basic data
    }
  };

  // ✅ update() — only updates local state + localStorage.
  //    Callers (Settings, IDEPage) handle their own API.put() calls.
  //    This prevents the double-save "Failed to save" toast.
  const update = (userData) => {
    const merged = { ...user, ...userData };
    setUser(merged);
    try {
      localStorage.setItem('simwork_user_v3', JSON.stringify(merged));
    } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('simwork_user_v3');
      localStorage.removeItem('simwork_sims_v3');
    } catch (_) {}
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