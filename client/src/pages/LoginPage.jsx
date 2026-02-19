import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import Logo from "../components/Logo";
import AuthPanel from "../components/AuthPanel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { useAuthStore } from "../stores/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore(); // zustand store
  const { authUser, checkAuth, loading: authLoading } = useAuth(); // context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ถ้า user login แล้ว ให้ redirect ไป /chat
  useEffect(() => {
    if (authUser) {
      navigate("/chat", { replace: true });
    }
  }, [authUser, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <p className="text-base-content/70">Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // login ผ่าน useAuthStore
      await login({ email, password });

      // login สำเร็จแล้ว sync AuthContext
      await checkAuth();

      // redirect ไปหน้า chat
      navigate("/chat", { replace: true });
    } catch (err) {
      // ดึง error message ให้ user เห็น
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header variant="auth" />
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" />
            </div>

            <h1 className="text-2xl font-bold text-base-content mb-1">
              Welcome Back
            </h1>
            <p className="text-base-content/70 text-sm mb-8">
              Sign in to your account
            </p>

            {error && (
              <p className="w-full text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" disabled={submitting || isLoggingIn}>
                {submitting || isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="mt-6 text-base-content/70 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <AuthPanel
          title="Welcome back!"
          description="Sign in to continue your conversations and catch up with your messages."
        />
      </div>
    </div>
  );
}
