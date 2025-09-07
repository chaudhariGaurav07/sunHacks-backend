import dotenv from 'dotenv'
dotenv.config();
import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
console.log(OPENROUTER_API_KEY)
export async function askAI(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", 
        messages: [
          { role: "system", content: "You are a helpful AI study assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log("AI raw response:", JSON.stringify(data, null, 2));

    return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("AI error:", err);
    return "Error fetching AI response.";
  }
}
