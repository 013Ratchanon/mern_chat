import { apiRequest, API_ENDPOINTS } from "./client";

export async function getFriends() {
  return apiRequest(API_ENDPOINTS.friends, { method: "GET" });
}

export async function addFriend(friendId) {
  return apiRequest(API_ENDPOINTS.friends, {
    method: "POST",
    body: JSON.stringify({ friendId }),
  });
}

export async function checkFriends(userId) {
  return apiRequest(API_ENDPOINTS.friendCheck(userId), { method: "GET" });
}
