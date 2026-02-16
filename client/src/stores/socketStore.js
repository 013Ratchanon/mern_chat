import { create } from "zustand";
import { io } from "socket.io-client";

const getSocketUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return url.replace(/\/$/, "");
};

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,

  connect: (token) => {
    const { socket } = get();
    if (socket?.connected) return;
    if (socket) socket.disconnect();
    const url = getSocketUrl();
    const s = io(url, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    s.on("connect", () => set({ connected: true }));
    s.on("disconnect", () => set({ connected: false }));
    set({ socket: s, connected: s.connected });
    return s;
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },
}));
