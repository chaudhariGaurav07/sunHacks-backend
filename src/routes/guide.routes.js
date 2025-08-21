import express from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  uploadAndGenerateGuide,
  getMyGuides,
} from "../controllers/guide.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadAndGenerateGuide);
router.get("/my-guides", authMiddleware, getMyGuides);

export default router;
