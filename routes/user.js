import express from 'express';
import { updateProfile, completeOnboarding } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', auth, updateProfile);
router.post('/onboarding', auth, completeOnboarding);

export default router;