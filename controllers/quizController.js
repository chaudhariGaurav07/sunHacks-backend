import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { askAI } from "../utils/aiClient.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, source, text } = req.body;

    const quizJson = await askAI(`
      Generate a quiz with 3 multiple-choice questions in pure JSON.
      Do not include markdown, code fences, or extra text.
      Format: [
        {
          "question": "...",
          "options": ["...","...","...","..."],
          "correctAnswer": "...",
          "explanation": "..."
        }
      ]
      Content to base quiz on: ${text || title}
    `);

    let cleaned = quizJson
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let questions = [];
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse error:", err);
      questions = [
        {
          question: "Error parsing AI response",
          options: ["N/A"],
          correctAnswer: "N/A",
          explanation: quizJson
        }
      ];
    }

    const quiz = await Quiz.create({
      title,
      userId: req.user.id,
      source,
      questions
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to submit this quiz' });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Update quiz with attempt
    quiz.attempts.push({
      answers,
      score,
      timeTaken: 0
    });

    if (score > quiz.bestScore) {
      quiz.bestScore = score;
    }

    await quiz.save();

    // Update user points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: score }
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};