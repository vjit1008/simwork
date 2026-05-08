import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { showToast } from '../components/Toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('simwork_user_v3');

    if (!token) {
      // No token — not logged in, show app immediately
      setLoading(false);
      return;
    }

    // Show stale data instantly (no visual flash)
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }

    // Silently sync fresh data from DB in background
    API.get('/api/user/me')
      .then(({ data }) => {
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('simwork_user_v3', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Token expired/invalid — axios interceptor handles redirect to /login
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);           // ← save token on login
    localStorage.setItem('simwork_user_v3', JSON.stringify(userData));
    setUser(userData);
  };

  const update = async (partial) => {
    try {
      const { data } = await API.put('/api/user/me', partial);
      if (data.success) {
        setUser(data.user);
        try {
          localStorage.setItem('simwork_user_v3', JSON.stringify(data.user));
        } catch (e) {}
      }
    } catch (err) {
      console.error('❌ Update failed:', err);
      showToast('❌ Failed to save changes');
    }
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
    <AuthContext.Provider value={{
      user, login, update, logout,
      loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};