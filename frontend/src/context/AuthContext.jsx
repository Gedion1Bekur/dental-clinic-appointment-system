import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi,
  setAccessToken,
  setUnauthorizedHandler,
  refreshToken,
} from '../services/api';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

function persistSession(accessToken, user) {
  setAccessToken(accessToken);
  storage.setUser(user);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    storage.clearSession();
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = storage.getAccessToken();
      const savedUser = storage.getUser();

      if (savedToken) {
        setAccessToken(savedToken);
        if (savedUser) setUser(savedUser);
      }

      const refreshed = await refreshToken();
      if (refreshed?.accessToken) {
        persistSession(refreshed.accessToken, refreshed.user);
        setUser(refreshed.user);
        try {
          const { user: profile } = await authApi.me();
          setUser(profile);
          storage.setUser(profile);
        } catch {
          /* keep refreshed user */
        }
        setLoading(false);
        return;
      }

      if (savedToken && savedUser) {
        try {
          const { user: profile } = await authApi.me();
          setUser(profile);
          storage.setUser(profile);
          setLoading(false);
          return;
        } catch {
          /* token expired, try remember me */
        }
      }

      const remembered = storage.getRememberedCredentials();
      if (remembered?.email && remembered?.password) {
        try {
          const data = await authApi.login({
            email: remembered.email,
            password: remembered.password,
          });
          persistSession(data.accessToken, data.user);
          setUser(data.user);
          setLoading(false);
          return;
        } catch {
          /* invalid saved credentials */
        }
      }

      clearSession();
      setLoading(false);
    }

    restoreSession();
  }, [clearSession]);

  const login = async (email, password, rememberMe = false) => {
    setAccessToken(null);
    const data = await authApi.login({ email, password });
    persistSession(data.accessToken, data.user);
    setUser(data.user);

    if (rememberMe) {
      storage.setRememberedCredentials(email, password);
    } else {
      storage.clearRememberedCredentials();
    }

    return data.user;
  };

  const register = async (name, email, password, rememberMe = false) => {
    await authApi.register({ name, email, password });
    return login(email, password, rememberMe);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    setUser: (u) => {
      setUser(u);
      storage.setUser(u);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
