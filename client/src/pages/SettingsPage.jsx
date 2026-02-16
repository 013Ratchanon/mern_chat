import Header from "../components/Header";
import { useThemeStore, THEMES } from "../stores/themeStore";
import { Send } from "lucide-react";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header variant="chat" />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Theme */}
          <section>
            <h2 className="text-lg font-semibold text-base-content mb-1">Theme</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Choose a theme for your chat interface.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {THEMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTheme(name)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-colors ${
                    theme === name
                      ? "border-warning bg-base-200"
                      : "border-base-300 bg-base-200/50 hover:border-base-content/30"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shrink-0 ring-2 ring-base-content/10"
                    style={{
                      backgroundColor:
                        name === "light"
                          ? "#f5f5f5"
                          : name === "dark"
                            ? "#1f2937"
                            : name === "cyberpunk"
                              ? "#f872b5"
                              : name === "cupcake"
                                ? "#f9d5d5"
                                : name === "sechat"
                                  ? "#f97316"
                                  : "var(--p)",
                    }}
                  />
                  <span className="text-xs font-medium text-base-content truncate w-full text-center">
                    {capitalize(name)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Preview */}
          <section>
            <h2 className="text-lg font-semibold text-base-content mb-1">Preview</h2>
            <p className="text-sm text-base-content/70 mb-4">
              How your chat will look with the selected theme.
            </p>
            <div className="rounded-xl border border-base-300 bg-base-200 overflow-hidden max-w-md">
              <div className="p-3 border-b border-base-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-bold">
                  J
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-base-content">John Doe</p>
                  <p className="text-xs text-base-content/60">Online</p>
                </div>
              </div>
              <div className="p-4 space-y-3 min-h-[120px]">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
                  <div className="rounded-2xl rounded-tl-none px-4 py-2 bg-base-300 max-w-[85%]">
                    <p className="text-sm text-base-content">Hey! How&apos;s it going?</p>
                    <p className="text-xs text-base-content/60 mt-0.5">12:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="rounded-2xl rounded-tr-none px-4 py-2 bg-primary text-primary-content max-w-[85%]">
                    <p className="text-sm">I&apos;m doing great! Just working on some new features.</p>
                    <p className="text-xs opacity-80 mt-0.5">12:00 PM</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
                </div>
              </div>
              <div className="p-3 border-t border-base-300 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="This is a preview"
                  className="flex-1 input input-bordered input-sm bg-base-100 text-base-content"
                />
                <button type="button" className="btn btn-primary btn-sm btn-square" aria-label="Send">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
