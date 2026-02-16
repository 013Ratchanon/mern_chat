import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "sechat",
];

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (name) => set((state) => (THEMES.includes(name) ? { theme: name } : state)),
    }),
    { name: "se-chat-theme" }
  )
);
