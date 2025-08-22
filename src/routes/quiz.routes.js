import express from "express";
import { createQuiz, submitQuiz, fetchUserQuizzes } from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middleware/auth.js"; // Auth middleware

const router = express.Router();



router.post("/create",authMiddleware, createQuiz);
router.post("/submit",authMiddleware, submitQuiz);
router.get("/my-quizzes",authMiddleware, fetchUserQuizzes);

export default router;
