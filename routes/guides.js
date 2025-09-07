import express from 'express';
import multer from 'multer';
import { uploadGuide, getMyGuides } from '../controllers/guideController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/upload', auth, upload.single('file'), uploadGuide);
router.get('/my-guides', auth, getMyGuides);

export default router;