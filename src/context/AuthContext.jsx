import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { disconnectSocket } from '../api/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ludo_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (tok) => {
    const t = tok || token;
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.me(t);
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('ludo_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, []);

  function loginWithToken(tok, userData) {
    localStorage.setItem('ludo_token', tok);
    setToken(tok);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('ludo_token');
    setToken(null);
    setUser(null);
    disconnectSocket();
  }

  function updateCoins(coins) {
    setUser((u) => (u ? { ...u, coins } : u));
  }

  return (
    <AuthContext.Provider
      value={{ token, user, loading, loginWithToken, logout, refreshUser, updateCoins }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
