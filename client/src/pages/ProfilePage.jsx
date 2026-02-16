import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Camera, User, Mail } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile as updateProfileApi } from "../api/user.api";
import Button from "../components/Button";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await updateProfileApi({ fullname });
      await refreshUser();
      setSuccess("Profile updated successfully.");
      toast.success("Profile updated");
    } catch (err) {
      const msg = err.data?.message || err.message || "Update failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateProfileApi({ fullname: user?.fullname ?? fullname, profilePicture: reader.result });
        await refreshUser();
        setSuccess("Photo updated successfully.");
        toast.success("Photo updated");
      } catch (err) {
        const msg = err.data?.message || err.message || "Photo update failed";
        setError(msg);
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toISOString().slice(0, 10)
    : "—";

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header variant="chat" />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-base-300 bg-base-200 p-6 lg:p-8 shadow-lg">
            <h1 className="text-xl font-bold text-center text-base-content">Profile</h1>
            <p className="text-sm text-center text-base-content/70 mb-6">
              Your profile information
            </p>

            {/* Profile picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-base-300 bg-base-300 flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-base-content/40" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-base-content text-base-100 flex items-center justify-center shadow hover:opacity-90 transition-opacity"
                  aria-label="Update photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-xs text-base-content/60 mt-2">
                Click the camera icon to update your photo
              </p>
            </div>

            {error && (
              <p className="text-sm text-error bg-error/10 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}
            {success && (
              <p className="text-sm text-success bg-success/10 rounded-lg px-4 py-2 mb-4">
                {success}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-base-content mb-1">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-base-content"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-base-content mb-1">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="input input-bordered w-full bg-base-300/50 text-base-content/80 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-base-300">
                <h3 className="text-sm font-semibold text-base-content mb-3">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-content/80">Member Since</span>
                    <span className="text-sm text-base-content">{memberSince}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-content/80">Account Status</span>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
