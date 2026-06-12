import { Router } from "express";
import {
  getMessagesByRoom,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/:roomId", getMessagesByRoom);
router.post("/", sendMessage);
router.delete("/:messageId", deleteMessage);

export default router;