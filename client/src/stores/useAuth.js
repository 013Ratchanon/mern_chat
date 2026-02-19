import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
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
      set({ authUser: response.data });
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
      set({ authUser: response.data });
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
}));
