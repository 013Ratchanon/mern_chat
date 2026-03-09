import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

import { useAuth } from "../contexts/AuthContext";
import { useSocketStore } from "../stores/socketStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/chatStore";

import * as friendsApi from "../api/friends.api";
import * as messagesApi from "../api/messages.api";
import { searchUsers } from "../api/user.api";

export default function ChatPage() {
  const { user: me } = useAuth();
  const socket = useSocketStore((s) => s.socket);
  const connected = useSocketStore((s) => s.connected);
  const { onlineUsers } = useAuthStore();
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
    if (!me) return;

    setLoadingContacts(true);
    try {
      const list = await friendsApi.getFriends();

      setContacts(
        Array.isArray(list)
          ? list.map((u) => ({
              ...u,
              id: u._id,
              name: u.fullname,
              avatar: u.profilePicture,
            }))
          : [],
      );
    } catch (error) {
      console.error(error);
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [me]);

  useEffect(() => {
    if (!me) return;
    loadContacts();
  }, [loadContacts, me]);

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

        toast(
          `${name}: ${(message.text || "").slice(0, 40)}${
            (message.text || "").length > 40 ? "…" : ""
          }`,
          { icon: "💬" },
        );
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

  const addFriendByEmail = async () => {
    const q = addFriendEmail.trim();

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

      const toAdd = users[0];

      await friendsApi.addFriend(toAdd._id);

      setAddFriendSuccess(`Added ${toAdd.fullname || toAdd.email}`);
      setAddFriendEmail("");

      toast.success(`Added ${toAdd.fullname || toAdd.email}`);

      await loadContacts();
    } catch (err) {
      const msg = err.data?.message || err.message || "Failed to add friend";
      setAddFriendError(msg);
      toast.error(msg);
    } finally {
      setAddFriendLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();

    const text = messageInput.trim();

    if (!text || !selectedId || !areFriends) return;

    if (!socket?.connected) {
      toast.error("Not connected");
      return;
    }

    setSending(true);

    socket.emit("send_message", { recipientId: selectedId, text }, (res) => {
      setSending(false);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.message) {
        addMessage(selectedId, res.message);
        setMessageInput("");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header variant="chat" />

      <div className="flex-1 flex min-h-0 border-t border-base-300">
        <Sidebar
          contacts={contacts}
          loadingContacts={loadingContacts}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          connected={connected}
          onlineUsers={onlineUsers}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-base-100">
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center mb-6 ring-2 ring-primary/30">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl font-bold mb-2">Welcome to SE Chat!</h2>

                <p className="text-sm text-base-content/70 mb-6">
                  Select a conversation or add a friend.
                </p>

                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    value={addFriendEmail}
                    onChange={(e) => setAddFriendEmail(e.target.value)}
                    placeholder="Friend email"
                    className="input input-bordered"
                  />

                  <button
                    className="btn btn-primary"
                    onClick={addFriendByEmail}
                    disabled={addFriendLoading}
                  >
                    {addFriendLoading ? "Adding..." : "Add Friend"}
                  </button>

                  {addFriendError && (
                    <p className="text-error text-sm">{addFriendError}</p>
                  )}

                  {addFriendSuccess && (
                    <p className="text-success text-sm">{addFriendSuccess}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ChatHeader contact={selectedContact} onClose={handleCloseChat} />

              <div className="flex-1 overflow-auto p-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  <ChatMessages
                    messages={messages}
                    me={me}
                    contact={selectedContact}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </div>

              <ChatInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                onSend={handleSendMessage}
                areFriends={areFriends}
                sending={sending}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
