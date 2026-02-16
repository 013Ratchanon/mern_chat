const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  register: `${API_BASE}/api/v1/user/register`,
  login: `${API_BASE}/api/v1/user/login`,
  logout: `${API_BASE}/api/v1/user/logout`,
  checkAuth: `${API_BASE}/api/v1/user/check`,
  updateProfile: `${API_BASE}/api/v1/user/update-profile`,
  searchUsers: `${API_BASE}/api/v1/user/search`,
  friends: `${API_BASE}/api/v1/friends`,
  friendCheck: (userId) => `${API_BASE}/api/v1/friends/check/${userId}`,
  messages: `${API_BASE}/api/v1/messages`,
};

export default API_BASE;
