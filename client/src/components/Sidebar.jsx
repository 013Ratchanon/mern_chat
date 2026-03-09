import { Users } from "lucide-react";
import { useState } from "react";
import Avatar from "./Avatar";

// a simple sidebar showing contacts and connection status
export default function Sidebar({
  contacts = [],
  loadingContacts = false,
  selectedId,
  setSelectedId,
  connected,
  onlineUsers = [],
}) {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredContacts = showOnlineOnly
    ? contacts.filter((c) => onlineUsers.includes(c._id))
    : contacts;

  const onlineCount = onlineUsers.length;

  console.log("Sidebar onlineUsers:", onlineUsers); // Debug log

  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-base-300 bg-base-200">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-base-content/60" />
          <h2 className="font-semibold text-base-content">Contacts</h2>
          {connected && (
            <span
              className="w-2 h-2 rounded-full bg-success"
              title="Connected"
            />
          )}
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-base-content/70 text-sm">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
          />
          <span>Show online only</span>
          <span className="text-base-content/50">({onlineCount} online)</span>
        </label>
      </div>
      <div className="flex-1 overflow-auto">
        {loadingContacts ? (
          <div className="flex items-center justify-center px-4 py-8">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex items-center justify-center px-4 py-8">
            <p className="text-sm text-base-content/50">
              No contacts. Add friends to chat.
            </p>
          </div>
        ) : (
          <ul className="p-2 space-y-0.5">
            {filteredContacts.map((contact) => {
              const isOnline = onlineUsers.includes(contact._id);
              return (
                <li key={contact.id || contact._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(contact.id || contact._id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      (contact.id || contact._id) === selectedId
                        ? "bg-primary/20"
                        : "hover:bg-base-300"
                    }`}
                  >
                    <Avatar
                      name={contact.name || contact.fullname}
                      src={contact.avatar || contact.profilePicture}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-base-content truncate">
                        {contact.name || contact.fullname}
                      </p>
                      <p
                        className={`text-xs ${
                          isOnline ? "text-success" : "text-base-content/60"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
