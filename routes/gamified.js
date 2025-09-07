import express from 'express';
import { updateStreak, assignBadge, getLeaderboard } from '../controllers/gamifiedController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/streak', auth, updateStreak);
router.post('/badge', auth, assignBadge);
router.get('/leaderboard', auth, getLeaderboard);

export default router;