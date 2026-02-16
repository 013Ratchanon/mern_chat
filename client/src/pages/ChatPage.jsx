import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  Users,
  X,
  Paperclip,
  Smile,
  Send,
  MessageCircle,
} from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useSocketStore } from "../stores/socketStore";
import { useChatStore } from "../stores/chatStore";
import * as friendsApi from "../api/friends.api";
import * as messagesApi from "../api/messages.api";
import { searchUsers } from "../api/user.api";

function Avatar({ name, src, className = "w-10 h-10" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`${className} rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const { user: me } = useAuth();
  const socket = useSocketStore((s) => s.socket);
  const connected = useSocketStore((s) => s.connected);
  const { getMessages, setMessages, addMessage } = useChatStore();

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [areFriends, setAreFriends] = useState(false);
  const [loadingFriendCheck, setLoadingFriendCheck] = useState(false);
  const [addFriendEmail, setAddFriendEmail] = useState("");
  const [addFriendLoading, setAddFriendLoading] = useState(false);
  const [addFriendError, setAddFriendError] = useState("");
  const [addFriendSuccess, setAddFriendSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedContact = selectedId
    ? contacts.find((c) => c.id === selectedId || c._id === selectedId)
    : null;

  const messages = selectedId ? getMessages(selectedId) : [];

  const loadContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const list = await friendsApi.getFriends();
      setContacts(
        Array.isArray(list)
          ? list.map((u) => ({ ...u, id: u._id, name: u.fullname, avatar: u.profilePicture }))
          : []
      );
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (!selectedId || !me) return;
    setLoadingFriendCheck(true);
    friendsApi
      .checkFriends(selectedId)
      .then(({ areFriends: ok }) => {
        setAreFriends(ok);
        if (ok) {
          setLoadingMessages(true);
          return messagesApi.getMessagesWith(selectedId).then((list) => {
            setMessages(selectedId, Array.isArray(list) ? list : []);
          });
        }
        setMessages(selectedId, []);
      })
      .catch(() => {
        setAreFriends(false);
        setMessages(selectedId, []);
      })
      .finally(() => {
        setLoadingFriendCheck(false);
        setLoadingMessages(false);
      });
  }, [selectedId, me, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (message) => {
      const senderId = message.sender?._id ?? message.sender;
      const recipientId = message.recipient?._id ?? message.recipient;
      const otherId = senderId === me?._id ? recipientId : senderId;
      addMessage(otherId, message);
      if (selectedId !== otherId) {
        const name = message.sender?.fullname || "Someone";
        toast(`${name}: ${(message.text || "").slice(0, 40)}${(message.text || "").length > 40 ? "…" : ""}`, {
          icon: "💬",
        });
      }
    };
    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, me, selectedId, addMessage]);

  const handleCloseChat = () => {
    setSelectedId(null);
    setAreFriends(false);
    setAddFriendError("");
  };

  const addFriendByEmail = async (emailOrName) => {
    const q = (emailOrName || addFriendEmail).trim();
    if (!q) {
      setAddFriendError("Enter email or name");
      return;
    }
    setAddFriendError("");
    setAddFriendSuccess("");
    setAddFriendLoading(true);
    try {
      const users = await searchUsers(q);
      if (!users?.length) {
        setAddFriendError("No user found");
        return;
      }
      if (users.length > 1 && !users.some((u) => u.email === q || u.fullname === q)) {
        setAddFriendError("Multiple users – use full email");
        return;
      }
      const toAdd = users.length === 1 ? users[0] : users.find((u) => u.email === q) || users[0];
      await friendsApi.addFriend(toAdd._id);
      setAddFriendSuccess(`Added ${toAdd.fullname || toAdd.email}`);
      setAddFriendEmail("");
      toast.success(`Added ${toAdd.fullname || toAdd.email} as friend`);
      await loadContacts();
      if (selectedId && toAdd._id === selectedId) {
        setAreFriends(true);
        setMessages(selectedId, []);
        const list = await messagesApi.getMessagesWith(selectedId);
        setMessages(selectedId, Array.isArray(list) ? list : []);
      }
    } catch (err) {
      const msg = err.data?.message || err.message || "Failed to add friend";
      setAddFriendError(msg);
      toast.error(msg);
    } finally {
      setAddFriendLoading(false);
    }
  };

  const handleAddFriend = () => addFriendByEmail();

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = messageInput.trim();
    if (!text || !selectedId || !areFriends) return;
    if (!socket?.connected) {
      toast.error("Not connected. Send again when online.");
      return;
    }
    setSending(true);
    socket.emit(
      "send_message",
      { recipientId: selectedId, text },
      (res) => {
        setSending(false);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        if (res?.message) {
          addMessage(selectedId, res.message);
          setMessageInput("");
        }
      }
    );
  };

  const filteredContacts = contacts;
  const onlineCount = 0;

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header variant="chat" />
      <div className="flex-1 flex min-h-0 border-t border-base-300">
        <aside className="w-72 shrink-0 flex flex-col border-r border-base-300 bg-base-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-base-content/60" />
              <h2 className="font-semibold text-base-content">Contacts</h2>
              {connected && (
                <span className="w-2 h-2 rounded-full bg-success" title="Connected" />
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-base-content/70 text-sm">
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
                <p className="text-sm text-base-content/50">No contacts. Add friends to chat.</p>
              </div>
            ) : (
              <ul className="p-2 space-y-0.5">
                {filteredContacts.map((contact) => (
                  <li key={contact.id || contact._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(contact.id || contact._id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        (contact.id || contact._id) === selectedId ? "bg-primary/20" : "hover:bg-base-300"
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
                        <p className="text-xs text-base-content/60">Offline</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-base-100">
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center mb-6 ring-2 ring-primary/30">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-base-content mb-2">Welcome to SE Chat!</h2>
                <p className="text-sm text-base-content/70 mb-6">
                  Select a conversation from the sidebar or add a friend by email.
                </p>
                <div className="w-full max-w-sm flex flex-col gap-2">
                  <input
                    type="text"
                    value={addFriendEmail}
                    onChange={(e) => {
                      setAddFriendEmail(e.target.value);
                      setAddFriendError("");
                      setAddFriendSuccess("");
                    }}
                    placeholder="Friend's email or name"
                    className="input input-bordered w-full bg-base-100 text-base-content"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => addFriendByEmail()}
                    disabled={addFriendLoading}
                  >
                    {addFriendLoading ? "Adding…" : "Add Friend"}
                  </button>
                  {addFriendError && <p className="text-sm text-error">{addFriendError}</p>}
                  {addFriendSuccess && <p className="text-sm text-success">{addFriendSuccess}</p>}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={selectedContact.name || selectedContact.fullname}
                    src={selectedContact.avatar || selectedContact.profilePicture}
                  />
                  <div>
                    <p className="font-medium text-base-content">
                      {selectedContact.name || selectedContact.fullname}
                    </p>
                    <p className="text-xs text-base-content/60">Offline</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 min-h-0">
                {loadingFriendCheck ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="loading loading-spinner loading-md text-primary" />
                  </div>
                ) : !areFriends ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <p className="text-error font-medium">
                      You must be friends with this user to send messages.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                      <input
                        type="text"
                        value={addFriendEmail}
                        onChange={(e) => setAddFriendEmail(e.target.value)}
                        placeholder="Search by email or name"
                        className="input input-bordered flex-1 bg-base-100 text-base-content"
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddFriend}
                        disabled={addFriendLoading}
                      >
                        {addFriendLoading ? "Adding…" : "Add Friend"}
                      </button>
                    </div>
                    {addFriendError && <p className="text-sm text-error">{addFriendError}</p>}
                    {addFriendSuccess && <p className="text-sm text-success">{addFriendSuccess}</p>}
                  </div>
                ) : loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="loading loading-spinner loading-md text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {messages.map((msg) => {
                      const isMe =
                        msg.sender?._id === me?._id || msg.sender === me?._id;
                      const senderName =
                        msg.sender?.fullname || (isMe ? "Me" : selectedContact?.fullname);
                      return (
                        <div
                          key={msg._id}
                          className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar
                            name={senderName}
                            src={msg.sender?.profilePicture}
                            className="w-8 h-8"
                          />
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isMe
                                ? "rounded-tr-none bg-primary text-primary-content"
                                : "rounded-tl-none bg-base-300 text-base-content"
                            }`}
                          >
                            {msg.text && <p className="text-sm">{msg.text}</p>}
                            {msg.file && (
                              <img
                                src={msg.file}
                                alt=""
                                className="rounded max-w-full max-h-48 mt-1"
                              />
                            )}
                            <p
                              className={`text-xs mt-0.5 ${
                                isMe ? "opacity-80" : "text-base-content/60"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="shrink-0 p-4 border-t border-base-300 bg-base-200">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="input input-bordered flex-1 bg-base-100 text-base-content"
                    disabled={!areFriends}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-square"
                    aria-label="Attach file"
                    disabled={!areFriends}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-square"
                    aria-label="Emoji"
                    disabled={!areFriends}
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-square"
                    aria-label="Send"
                    disabled={!areFriends || sending}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
