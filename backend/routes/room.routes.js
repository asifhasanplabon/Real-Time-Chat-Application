import { Router } from "express";
import {
  getRooms,
  createRoom,
  getRoomById,
  addMember,
} from "../controllers/room.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId", getRoomById);
router.patch("/:roomId/members", addMember);

export default router;