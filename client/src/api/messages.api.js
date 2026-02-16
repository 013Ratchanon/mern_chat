import { apiRequest, API_ENDPOINTS } from "./client";

export async function getMessagesWith(userId) {
  return apiRequest(`${API_ENDPOINTS.messages}?with=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

export async function sendMessage(recipient, text, file = "") {
  return apiRequest(API_ENDPOINTS.messages, {
    method: "POST",
    body: JSON.stringify({ recipient, text, file }),
  });
}
