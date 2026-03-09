import { Paperclip, Smile, Send } from "lucide-react";

export default function ChatInput({
  messageInput,
  setMessageInput,
  onSend,
  areFriends,
  sending,
}) {
  return (
    <div className="shrink-0 p-4 border-t border-base-300 bg-base-200">
      <form onSubmit={onSend} className="flex gap-2 items-end">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered flex-1"
          disabled={!areFriends}
        />

        <button
          type="button"
          className="btn btn-ghost btn-square"
          disabled={!areFriends}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-square"
          disabled={!areFriends}
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-square"
          disabled={!areFriends || sending}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
