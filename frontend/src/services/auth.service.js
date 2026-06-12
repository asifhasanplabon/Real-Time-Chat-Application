import api from "./api.js";

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const logoutUser = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");

export const updateProfile = (data) => api.patch("/auth/profile", data);