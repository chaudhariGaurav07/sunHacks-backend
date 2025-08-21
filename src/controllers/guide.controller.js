import fs from "fs";
import path from "path";
import { createRequire } from "module";
import StudyGuide from "../models/StudyGuide.js";
import {
  generateSummary,
  generateFlashcards,
  generateMindmap,
  generateAudio,
} from "../services/ai.service.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Upload + AI Guide Generator with multi-mode filters
const uploadAndGenerateGuide = async (req, res, next) => {
  try {
    // Ensure absolute path
    const filePath = path.resolve(req.file.path);
    const dataBuffer = fs.readFileSync(filePath);

    // Parse PDF text
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Get modes from request body (array expected)
    const { modes } = req.body;
    const selectedModes = Array.isArray(modes) ? modes : [];

    // Containers for outputs
    let summary, flashcards, mindmap, audioUrl;

    // Generate only requested outputs
    if (selectedModes.includes("summary")) {
      summary = await generateSummary(text);
    }
    if (selectedModes.includes("flashcards")) {
      flashcards = await generateFlashcards(text);
    }
    if (selectedModes.includes("mindmap")) {
      mindmap = await generateMindmap(text);
    }
    if (selectedModes.includes("audio")) {
      // Audio needs some text to read → fallback to summary → fallback to raw text
      const audioInput = summary || text;
      audioUrl = await generateAudio(audioInput);
    }

    // Save study guide in DB
    const studyGuide = await StudyGuide.create({
      user: req.user._id,
      title: req.file.originalname,
      originalFile: filePath,
      summary,
      flashcards,
      mindmap,
      audioUrl,
    });

    res.status(201).json({
      message: "Study guide generated successfully",
      studyGuide,
    });
  } catch (error) {
    console.error("Error generating study guide:", error);
    next(error);
  }
};

// Fetch logged-in user's guides
const getMyGuides = async (req, res, next) => {
  try {
    const guides = await StudyGuide.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

export { uploadAndGenerateGuide, getMyGuides };
