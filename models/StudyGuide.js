import mongoose from 'mongoose';

const studyGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  flashcards: [{
    front: String,
    back: String
  }],
  mindMap: {
    type: String, // Mermaid diagram syntax
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('StudyGuide', studyGuideSchema);