import api from "./api.js";

export const searchUsers = (q) =>
  api.get(`/users/search?q=${encodeURIComponent(q)}`);
