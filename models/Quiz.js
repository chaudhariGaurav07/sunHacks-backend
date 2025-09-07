import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  totalQuestions: {
    type: Number,
    default: 0
  },
  attempts: [{
    attemptedAt: { type: Date, default: Date.now },
    answers: [String],
    score: { type: Number, required: true },
    timeTaken: { type: Number, default: 0 } // in seconds
  }],
  bestScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

quizSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  next();
});

export default mongoose.model('Quiz', quizSchema);