import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeSync from "./components/ThemeSync";
import AppRouter from "./router";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  );
}

export default App;
