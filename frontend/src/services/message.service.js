import api from "./api.js";

export const getRooms = () => api.get("/rooms");

export const createRoom = (data) => api.post("/rooms", data);

export const getRoomById = (roomId) => api.get(`/rooms/${roomId}`);

export const addMember = (roomId, userId) =>
  api.patch(`/rooms/${roomId}/members`, { userId });

export const getMessagesByRoom = (roomId, page = 1, limit = 30) =>
  api.get(`/messages/${roomId}?page=${page}&limit=${limit}`);

export const sendMessageAPI = (data) => api.post("/messages", data);

export const deleteMessageAPI = (messageId) =>
  api.delete(`/messages/${messageId}`);