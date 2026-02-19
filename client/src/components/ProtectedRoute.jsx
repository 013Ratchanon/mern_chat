import { useAuthStore } from "../stores/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
