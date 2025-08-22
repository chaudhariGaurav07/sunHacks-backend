import { Router } from "express";
import { sendMessage } from "../controllers/chatbot.controller.js";
import {authMiddleware} from "../middleware/auth.js";

const router = Router();

router.post("/message", authMiddleware, sendMessage);

export default router;
