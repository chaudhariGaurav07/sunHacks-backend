import express from 'express';
import { createQuiz, submitQuiz, getMyQuizzes } from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, createQuiz);
router.post('/submit', auth, submitQuiz);
router.get('/my-quizzes', auth, getMyQuizzes);

export default router;