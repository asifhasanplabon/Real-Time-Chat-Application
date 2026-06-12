import { Router } from "express";
import { searchUsers } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/search", searchUsers);

export default router;
