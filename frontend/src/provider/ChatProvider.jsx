import { useState, useCallback, useEffect } from "react";
import { ChatContext } from "../context/ChatContext.jsx";
import { getRooms } from "../services/message.service.js";
import useAuth from "../hooks/useAuth.js";
import useSocket from "../hooks/useSocket.js";

const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const fetchRooms = useCallback(async () => {
    if (!user) return;
    setRoomsLoading(true);
    try {
      const data = await getRooms();
      setRooms(data.rooms || []);
    } catch {
      // silent — user likely not authenticated yet
    } finally {
      setRoomsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Update sidebar last-message and re-sort rooms when any new message arrives
  const updateRoomLastMessage = useCallback((roomId, message) => {
    setRooms((prev) =>
      [...prev.map((r) =>
        r._id.toString() === roomId.toString()
          ? { ...r, lastMessage: message, updatedAt: message.createdAt || new Date().toISOString() }
          : r
      )].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      updateRoomLastMessage(message.room, message);
    };
    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [socket, updateRoomLastMessage]);

  const addRoom = useCallback((room) => {
    setRooms((prev) => {
      if (prev.find((r) => r._id === room._id)) return prev;
      return [room, ...prev];
    });
    // Join the socket room so we receive its messages
    socket?.emit("join_room", { roomId: room._id });
  }, [socket]);

  // typingUsers[roomId] = [{ userId, userName }, ...]
  const addTypingUser = useCallback((roomId, userId, userName) => {
    setTypingUsers((prev) => ({
      ...prev,
      [roomId]: [
        ...(prev[roomId] || []).filter((u) => u.userId !== userId),
        { userId, userName },
      ],
    }));
  }, []);

  const removeTypingUser = useCallback((roomId, userId) => {
    setTypingUsers((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter((u) => u.userId !== userId),
    }));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        rooms,
        setRooms,
        roomsLoading,
        fetchRooms,
        addRoom,
        updateRoomLastMessage,
        typingUsers,
        addTypingUser,
        removeTypingUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
