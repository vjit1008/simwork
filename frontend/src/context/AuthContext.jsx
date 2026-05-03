import { createContext, useContext, useState, useEffect } from 'react';

// ✅ Named export for testing
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('simwork_user_v3');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {}
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('simwork_user_v3', JSON.stringify(userData));
    } catch (e) {}
  };

  const update = (partial) => {
    setUser(prev => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('simwork_user_v3', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    try {
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