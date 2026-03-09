import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  // ตรวจสอบ auth
  checkAuth: async () => {
    try {
      const response = await api.get("/user/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // สมัครสมาชิก
  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await api.post("/user/register", formData);
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      set({ authUser: response.data });
      get().connectSocket();
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // เข้าสู่ระบบ
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("/user/login", formData);
      // store access token so fetch‑based helpers can use it
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      set({ authUser: response.data });
      get().connectSocket();
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ออกจากระบบ
  logout: async () => {
    try {
      const response = await api.post("/user/logout");
      set({ authUser: null });
      get().disconnectSocket();
      localStorage.removeItem("accessToken");
      toast.success(response.data?.message || "Logged out successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Logout failed";
      toast.error(msg);
    }
  },

  // อัปเดตโปรไฟล์
  updateProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await api.put("/user/update-profile", profileData);
      set({ authUser: response.data.user });
      toast.success(response.data?.message || "Profile updated!");
    } catch (error) {
      const msg = error.response?.data?.message || "Profile update failed";
      toast.error(msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketURL, {
      query: { userId: authUser._id },
    });
    newSocket.connect();
    set({ socket: newSocket });
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
