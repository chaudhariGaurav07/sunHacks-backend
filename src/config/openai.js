// src/config/openai.js
import OpenAI from "openai";

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in environment variables");
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
