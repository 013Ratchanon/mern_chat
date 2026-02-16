import { apiRequest, API_ENDPOINTS } from "./client";

export async function register({ fullname, email, password }) {
  const data = await apiRequest(API_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify({ fullname, email, password }),
  });
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
}

export async function login({ email, password }) {
  const data = await apiRequest(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
}

export async function logout() {
  await apiRequest(API_ENDPOINTS.logout, { method: "POST" });
  localStorage.removeItem("accessToken");
}

export async function checkAuth() {
  return apiRequest(API_ENDPOINTS.checkAuth, { method: "GET" });
}

export async function updateProfile(body) {
  return apiRequest(API_ENDPOINTS.updateProfile, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function searchUsers(q) {
  return apiRequest(`${API_ENDPOINTS.searchUsers}?q=${encodeURIComponent(q)}`, {
    method: "GET",
  });
}
