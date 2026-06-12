import { useState, useEffect, useCallback } from "react";
import { getMessagesByRoom, sendMessageAPI } from "../services/message.service.js";
import useSocket from "./useSocket.js";
import useAuth from "./useAuth.js";
import useChat from "./useChat.js";

const useMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { addTypingUser, removeTypingUser } = useChat();

  // Fetch history whenever room changes
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessagesByRoom(roomId);
        setMessages(data.messages);
      } catch (error) {
        console.error("Messages fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  // Real-time: new messages + typing indicators
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceive = (message) => {
      if (message.room === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTypingStart = ({ userId, userName }) => {
      if (userId !== user?._id) {
        addTypingUser(roomId, userId, userName);
      }
    };

    const handleTypingStop = ({ userId }) => {
      removeTypingUser(roomId, userId);
    };

    socket.on("receive_message", handleReceive);
    socket.on("user_typing", handleTypingStart);
    socket.on("user_stopped_typing", handleTypingStop);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleTypingStart);
      socket.off("user_stopped_typing", handleTypingStop);
    };
  }, [socket, roomId, user, addTypingUser, removeTypingUser]);

  const sendMessage = useCallback(
    async ({ text, messageType = "text", fileUrl }) => {
      if (!roomId || !user) return;

      if (socket?.connected) {
        // Socket saves to DB and broadcasts — no REST call needed
        socket.emit("send_message", {
          roomId,
          senderId: user._id,
          text,
          messageType,
          fileUrl,
        });
      } else {
        // Fallback when socket is disconnected
        const data = await sendMessageAPI({ roomId, text, messageType, fileUrl });
        setMessages((prev) => [...prev, data.message]);
      }
    },
    [roomId, socket, user]
  );

  return { messages, loading, sendMessage };
};

export default useMessages;
