import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  messagesByConversation: {}, // { [userId]: message[] }

  setMessages: (userId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [userId]: Array.isArray(messages) ? messages : [],
      },
    })),

  addMessage: (userId, message) => {
    const key = typeof userId === "string" ? userId : userId?.toString?.();
    if (!key) return;
    set((state) => {
      const list = state.messagesByConversation[key] || [];
      const exists = list.some((m) => m._id === message._id);
      if (exists) return state;
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [key]: [...list, message],
        },
      };
    });
  },

  getMessages: (userId) => {
    const key = typeof userId === "string" ? userId : userId?.toString?.();
    return get().messagesByConversation[key] ?? [];
  },

  clearConversation: (userId) =>
    set((state) => {
      const next = { ...state.messagesByConversation };
      const key = typeof userId === "string" ? userId : userId?.toString?.();
      delete next[key];
      return { messagesByConversation: next };
    }),
}));
