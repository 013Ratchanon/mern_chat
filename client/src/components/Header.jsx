import { Link, useNavigate } from "react-router-dom";
import { Settings, User, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ variant = "auth" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link
        to={variant === "auth" ? "/" : "/chat"}
        className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
      >
        <Logo size="sm" />
      </Link>
      {variant === "auth" ? (
        <Link
          to="/settings"
          className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      ) : (
        <nav className="flex items-center gap-6">
          <Link to="/settings" className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <Link to="/profile" className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}
