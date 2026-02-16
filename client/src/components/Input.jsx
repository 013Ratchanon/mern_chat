import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-base-content/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 rounded-lg input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
