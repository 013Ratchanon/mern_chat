import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as userApi from "../api/user.api";
import { useSocketStore } from "../stores/socketStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const connectSocket = useSocketStore((s) => s.connect);
  const disconnectSocket = useSocketStore((s) => s.disconnect);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await userApi.checkAuth();
      setUser(userData);
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (user && token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
    return () => {};
  }, [user, connectSocket, disconnectSocket]);

  const login = async (email, password) => {
    const data = await userApi.login({ email, password });
    // Token is already stored by userApi.login()
    const userData = await userApi.checkAuth();
    setUser(userData);
    return data;
  };

  const register = async (fullname, email, password) => {
    const data = await userApi.register({ fullname, email, password });
    // Token is already stored by userApi.register()
    const userData = await userApi.checkAuth();
    setUser(userData);
    return data;
  };

  const logout = async () => {
    try {
      disconnectSocket();
      await userApi.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const userData = await userApi.checkAuth();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    refreshUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
