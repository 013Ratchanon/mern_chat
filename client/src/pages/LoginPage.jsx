import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Logo from "../components/Logo";
import AuthPanel from "../components/AuthPanel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <p className="text-base-content/70">Loading...</p>
      </div>
    );
  }
  if (user) {
    navigate("/chat", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Signed in!");
      navigate("/chat", { replace: true });
    } catch (err) {
      const msg = err.data?.message || err.message || "Login failed";
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
            <h1 className="text-2xl font-bold text-base-content mb-1">Welcome Back</h1>
            <p className="text-base-content/70 text-sm mb-8">Sign in to your account</p>
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
              <Button type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <p className="mt-6 text-base-content/70 text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
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
