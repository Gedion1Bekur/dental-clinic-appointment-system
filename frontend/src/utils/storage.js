const KEYS = {
  theme: 'dental_theme',
  accessToken: 'dental_access_token',
  user: 'dental_user',
  remember: 'dental_remember',
};

export const storage = {
  getTheme() {
    return localStorage.getItem(KEYS.theme) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(KEYS.theme, theme);
  },

  getAccessToken() {
    return localStorage.getItem(KEYS.accessToken);
  },

  setAccessToken(token) {
    if (token) localStorage.setItem(KEYS.accessToken, token);
    else localStorage.removeItem(KEYS.accessToken);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(KEYS.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) localStorage.setItem(KEYS.user, JSON.stringify(user));
    else localStorage.removeItem(KEYS.user);
  },

  getRememberedCredentials() {
    try {
      const raw = localStorage.getItem(KEYS.remember);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setRememberedCredentials(email, password) {
    localStorage.setItem(KEYS.remember, JSON.stringify({ email, password }));
  },

  clearRememberedCredentials() {
    localStorage.removeItem(KEYS.remember);
  },

  clearSession() {
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.user);
  },
};
