import { useEffect, useRef } from "react";
import UserAvatar from "./UserAvatar.jsx";
import useAuth from "../hooks/useAuth.js";

const MessageList = ({ messages, loading }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        এখনো কোনো মেসেজ নেই। প্রথম মেসেজ পাঠান!
      </div>
    );
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => {
        const isOwn = msg.sender._id === user?._id;

        return (
          <div
            key={msg._id}
            className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
          >
            {!isOwn && (
              <UserAvatar user={msg.sender} size="sm" />
            )}

            <div className={`flex flex-col gap-1 max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
              {!isOwn && (
                <span className="text-xs text-gray-400 px-1">
                  {msg.sender.name}
                </span>
              )}

              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                } ${msg.isDeleted ? "opacity-50 italic" : ""}`}
              >
                {msg.isDeleted ? "মেসেজটি মুছে ফেলা হয়েছে" : msg.text}
              </div>

              <span className="text-xs text-gray-400 px-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;