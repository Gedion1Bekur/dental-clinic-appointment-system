import { storage } from '../utils/storage';

const API_BASE = '/api';

let accessToken = storage.getAccessToken();
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token;
  storage.setAccessToken(token);
}

export function getAccessToken() {
  return accessToken;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, options = {}, retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const skipRefresh =
    path.includes('/auth/login') ||
    path.includes('/auth/register') ||
    path.includes('/auth/refresh');
  if (res.status === 401 && retry && !skipRefresh) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return request(path, options, false);
    }
    if (onUnauthorized) onUnauthorized();
    throw new Error('Session expired');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || data.message || 'Request failed';
    const err = new Error(message);
    err.details = data.details;
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function refreshToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.accessToken);
    if (data.user) storage.setUser(data.user);
    return data;
  } catch {
    return false;
  }
}

export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

export const usersApi = {
  list: () => request('/users'),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

export const appointmentsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/appointments${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
};

export const dentistsApi = {
  list: () => request('/dentists'),
  create: (body) => request('/dentists', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/dentists/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/dentists/${id}`, { method: 'DELETE' }),
  assignTreatment: (id, treatmentId) =>
    request(`/dentists/${id}/treatments`, {
      method: 'POST',
      body: JSON.stringify({ treatmentId }),
    }),
  removeTreatment: (id, treatmentId) =>
    request(`/dentists/${id}/treatments/${treatmentId}`, { method: 'DELETE' }),
};

export const treatmentsApi = {
  list: () => request('/treatments'),
  create: (body) => request('/treatments', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/treatments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/treatments/${id}`, { method: 'DELETE' }),
};
