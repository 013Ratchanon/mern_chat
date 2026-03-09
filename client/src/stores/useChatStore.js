import { create } from "zustand";
import api from "../services/api.js";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  users: [], // { [userId]: message[] }
  messages: [], // { senderId, content, timestamp }
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await api.get("/message/users");
      set({ users: response.data.users });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUserLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await api.post(
        "/message/send/" + selectedUser._id,
        messageData,
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to send message");
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await api.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to load messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
