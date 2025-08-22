import dotenv from "dotenv";
dotenv.config();

import Quiz from "../models/Quiz.js";
import fetch from "node-fetch";

const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY;
if (!OPEN_ROUTER_KEY) throw new Error("OPEN_ROUTER_API_KEY is missing in environment variables");

export const generateQuiz = async (userId, title, source, text) => {
  try {
    const prompt = `
      Generate 5 multiple-choice questions from this text.
      Each question must have "question", "options" (4), "correctAnswer", "explanation".
      Respond ONLY in valid JSON array.
      Text: """${text}"""
    `;

    const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPEN_ROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Open Router HTTP error:", response.status, errorText);
      throw new Error(`Open Router HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Debug full response
    console.log("Open Router response:", JSON.stringify(data, null, 2));

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Open Router returned no content");
      throw new Error("Open Router returned no content");
    }

    let questions;
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse Open Router JSON:", content, parseError);
      throw new Error("Open Router returned invalid JSON");
    }

    const quiz = await Quiz.create({
      user: userId,
      title,
      source,
      questions,
      totalQuestions: questions.length,
    });

    return quiz;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz via Open Router");
  }
};
