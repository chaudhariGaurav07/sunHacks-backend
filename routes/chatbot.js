import express from 'express';
import { chatResponse } from '../controllers/chatbotController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', auth, chatResponse);

export default router;