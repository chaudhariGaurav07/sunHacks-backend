import { askAI } from "../utils/aiClient.js";

export const chatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await askAI(message);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};