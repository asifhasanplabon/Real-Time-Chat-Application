import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { registerChatEvents } from "./socket/chatEvents.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import roomRoutes from "./routes/room.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.get("/",(req,res)=>{
  res.status(200).json({message: "The api is running properly"});
})
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

io.on("connection", (socket) => {
  console.log(`🟢 Connected: ${socket.id}`);
  registerChatEvents(io, socket);
  socket.on("disconnect", () => console.log(`🔴 Disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});