import { API_ENDPOINTS } from "../config/api";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };
  const config = {
    ...options,
    headers,
    credentials: "include",
  };
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export { API_ENDPOINTS };
