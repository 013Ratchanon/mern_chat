import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Logo from "../components/Logo";
import AuthPanel from "../components/AuthPanel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, loading, register } = useAuth();
  const [fullName, setFullName] = useState("");
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
      await register(fullName, email, password);
      toast.success("Account created!");
      navigate("/chat", { replace: true });
    } catch (err) {
      const msg = err.data?.message || err.message || "Registration failed";
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
            <h1 className="text-2xl font-bold text-base-content mb-1">Create Account</h1>
            <p className="text-base-content/70 text-sm mb-8">Get started with your free account</p>
            {error && (
              <p className="w-full text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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
                {submitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <p className="mt-6 text-base-content/70 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <AuthPanel
          title="Join our community"
          description="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </div>
  );
}
