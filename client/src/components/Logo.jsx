import { MessageCircle } from "lucide-react";

export default function Logo({ size = "sm" }) {
  const iconClass = size === "lg" ? "w-14 h-14" : "w-8 h-8";
  const iconSize = size === "lg" ? "w-8 h-8" : "w-5 h-5";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${iconClass} rounded-lg bg-primary flex items-center justify-center shrink-0 text-primary-content`}
        aria-hidden
      >
        <MessageCircle className={iconSize} strokeWidth={1.5} />
      </div>
      <span className="font-semibold text-base-content text-lg">SE Chat</span>
    </div>
  );
}
