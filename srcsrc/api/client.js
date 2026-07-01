const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'کچھ غلط ہو گیا');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
  claimBonus: (token) => request('/auth/claim-bonus', { method: 'POST', token }),
  bonusStatus: (token) => request('/auth/bonus-status', { token }),
  wallet: (token) => request('/wallet', { token }),

  adminOverview: (token) => request('/admin/overview', { token }),
  adminUsers: (token, page = 1, search = '') =>
    request(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`, { token }),
  adminToggleBan: (token, id) => request(`/admin/users/${id}/ban`, { method: 'PATCH', token }),
  adminAdjustCoins: (token, id, amount) =>
    request(`/admin/users/${id}/coins`, { method: 'PATCH', token, body: { amount } }),
  adminLiveMatches: (token) => request('/admin/matches/live', { token }),
  adminMatchHistory: (token, page = 1) => request(`/admin/matches?page=${page}`, { token }),
};

export { API_URL };
