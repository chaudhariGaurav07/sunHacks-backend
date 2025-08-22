import { generateQuiz, evaluateQuiz, getUserQuizzes} from "../services/quiz.service.js";

/**
 * Create a quiz from uploaded text/PDF content
 */
export const createQuiz = async (req, res, next) => {
  try {
    const { title, source, text } = req.body;
    if (!text || !title) {
      return res.status(400).json({ message: "Title and text are required" });
    }

    const quiz = await generateQuiz(req.user._id, title, source, text);
    res.status(201).json({ message: "Quiz generated successfully", quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit answers for a quiz
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId) return res.status(400).json({ message: "quizId is required" });
    if (!answers || !Array.isArray(answers))
      return res.status(400).json({ message: "answers must be a non-empty array" });

    const result = await evaluateQuiz(quizId, answers, req.user._id);
    res.json({ message: "Quiz evaluated", result });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all quizzes of the logged-in user
 */
export const fetchUserQuizzes = async (req, res, next) => {
  try {
    const quizzes = await getUserQuizzes(req.user._id);
    res.json({ quizzes });
  } catch (error) {
    next(error);
  }
};
