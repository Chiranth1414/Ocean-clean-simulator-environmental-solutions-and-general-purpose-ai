// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Paste your Gemini API key here (local only)
const GEMINI_API_KEY = "AIzaSyDNHTfBv42UlOgdVf6AwzZfNz7ldqKsgm8";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * /ask-ai
 * Environmental-focused assistant (keeps same behavior you had before).
 * Expects: { problem: "..." }
 */
app.post("/ask-ai", async (req, res) => {
  const { problem } = req.body;
  if (!problem) return res.status(400).json({ answer: "No problem provided." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an environmental expert assistant.
Provide a clear, practical solution to this environmental problem:
"${problem}"

- Briefly explain probable causes.
- Provide concise actionable steps and suggestions.
- Keep it focused and suitable for students or researchers.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Error /ask-ai:", error?.toString?.() || error);
    res.status(500).json({ answer: "Error processing AI request." });
  }
});

/**
 * /ask-general-ai
 * General-purpose assistant for the floating AI toggle.
 * Expects: { prompt: "..." }
 */
app.post("/ask-general-ai", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ answer: "No prompt provided." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Wrap the user's text lightly to encourage direct, general-purpose answers
    const wrapped = `
You are a helpful general-purpose assistant. Answer clearly and concisely.

User query:
\"\"\"${prompt}\"\"\"
`;

    const result = await model.generateContent(wrapped);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Error /ask-general-ai:", error?.toString?.() || error);
    res.status(500).json({ answer: "Error processing general AI request." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Server running with Gemini API at http://localhost:${PORT}`);
});
