import Avatar from "./Avatar";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessages({
  messages,
  me,
  contact,
  messagesEndRef,
}) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {messages.map((msg) => {
        const isMe = msg.sender?._id === me?._id || msg.sender === me?._id;

        const senderName =
          msg.sender?.fullname || (isMe ? "Me" : contact?.fullname);

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
                className={`text-xs mt-1 ${
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
  );
}
