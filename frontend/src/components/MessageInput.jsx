import { useState, useRef } from "react";
import useSocket from "../hooks/useSocket.js";
import useAuth from "../hooks/useAuth.js";

const MessageInput = ({ roomId, onSend }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const emitTyping = () => {
    socket?.emit("typing_start", { roomId, userId: user._id, userName: user.name });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing_stop", { roomId, userId: user._id });
    }, 1500);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    emitTyping();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    socket?.emit("typing_stop", { roomId, userId: user._id });

    try {
      await onSend({ roomId, text: text.trim() });
      setText("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="মেসেজ লিখুন..."
        rows={1}
        className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
        style={{ lineHeight: "1.5" }}
      />

      <button
        type="submit"
        disabled={!text.trim() || sending}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 flex-shrink-0"
      >
        {sending ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default MessageInput;