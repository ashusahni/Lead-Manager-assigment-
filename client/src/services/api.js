const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

/**
 * Helper to get auth headers with JWT token if available
 */
function getHeaders() {
  const token = localStorage.getItem('leadmanager_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle API response and extract JSON or error message
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.errors = data.errors || [];
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Leads
  leads: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.source && params.source !== 'All') query.append('source', params.source);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const res = await fetch(`${API_BASE}/leads?${query.toString()}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getStats: async () => {
      const res = await fetch(`${API_BASE}/leads/stats`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    create: async (leadData) => {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(leadData),
      });
      return handleResponse(res);
    },

    update: async (id, leadData) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(leadData),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
