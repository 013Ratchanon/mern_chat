import { X } from "lucide-react";
import Avatar from "./Avatar";

export default function ChatHeader({ contact, onClose }) {
  return (
    <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200">
      <div className="flex items-center gap-3">
        <Avatar
          name={contact.name || contact.fullname}
          src={contact.avatar || contact.profilePicture}
        />

        <div>
          <p className="font-medium text-base-content">
            {contact.name || contact.fullname}
          </p>

          <p className="text-xs text-base-content/60">Offline</p>
        </div>
      </div>

      <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
