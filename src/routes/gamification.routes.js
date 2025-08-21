// src/routes/gamification.routes.js
import { Router } from "express";
import { updateStreak, assignBadge, leaderboard } from "../controllers/gamification.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/streak", authMiddleware, updateStreak);
router.post("/badge", authMiddleware, assignBadge);
router.get("/leaderboard", leaderboard);

export default router;
