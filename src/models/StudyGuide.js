import mongoose from "mongoose";

const StudyGuideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    originalFile: { type: String }, // PDF path or S3 URL
    summary: { type: String },
    flashcards: [{ question: String, answer: String }],
    mindmap: { type: String }, // store mermaid text or JSON
    audioUrl: { type: String }, // generated TTS file
  },
  { timestamps: true }
);

export default mongoose.model("StudyGuide", StudyGuideSchema);
