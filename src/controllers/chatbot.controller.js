

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY;
if (!OPEN_ROUTER_KEY) throw new Error("OPEN_ROUTER_API_KEY is missing");

/**
 * Chatbot endpoint: answers user queries
 *
 * Request body:
 * {
 *   message: string,           // required
 *   context: array             // optional conversation context
 * }
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { message, context = [] } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Build the prompt for Open Router
    const prompt = `
      You are StudyGenie AI Chatbot.
      Answer user queries about study tips, quizzes, summaries, and learning advice.
      Respond concisely and clearly.
      User message: "${message}"
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPEN_ROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "StudyGenie Chatbot"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          ...context,
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Open Router HTTP error:", response.status, errorText);
      throw new Error(`Open Router HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) return res.status(500).json({ error: "Chatbot returned no response" });

    res.json({ reply: content });

  } catch (error) {
    console.error("Chatbot error:", error);
    next(error);
  }
};
