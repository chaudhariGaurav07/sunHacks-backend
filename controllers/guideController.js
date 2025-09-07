import StudyGuide from '../models/StudyGuide.js';
import { askAI } from "../utils/aiClient.js";


export const uploadGuide = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const guide = await StudyGuide.create({
      title: req.file.originalname.replace('.pdf', ''),
      userId: req.user.id,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      processingStatus: 'processing'
    });

    setTimeout(async () => {
  try {
    const summary = await askAI(`Summarize the study guide: ${guide.title}`);
    const flashcardsJson = await askAI(
      `Generate 3 flashcards in JSON format (front, back) for: ${guide.title}`
    );
    let flashcards = [];
    try {
      flashcards = JSON.parse(flashcardsJson);
    } catch {
      flashcards = [{ front: "Error", back: flashcardsJson }];
    }

    await StudyGuide.findByIdAndUpdate(guide._id, {
      summary,
      flashcards,
      processingStatus: "completed"
    });
  } catch (err) {
    console.error("AI update error:", err);
  }
}, 3000);

    res.status(201).json({
      success: true,
      message: 'Study guide uploaded successfully',
      guide: {
        id: guide._id,
        title: guide.title,
        processingStatus: guide.processingStatus,
        createdAt: guide.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyGuides = async (req, res) => {
  try {
    const guides = await StudyGuide.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      guides
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};