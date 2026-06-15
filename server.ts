import express from "express";
import path from "path";
import dotenv from "dotenv";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const dbPromise = open({
  filename: path.join(process.cwd(), "commitcraft.db"),
  driver: sqlite3.Database,
});

async function initDb() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      inputText TEXT NOT NULL,
      commitMessage TEXT NOT NULL,
      commitDescription TEXT NOT NULL,
      prTitle TEXT NOT NULL,
      prDescription TEXT NOT NULL,
      language TEXT NOT NULL,
      commitType TEXT NOT NULL
    )
  `);
  console.log("Database initialized successfully.");
}

// Lazy load Gemini Client to be resilient on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY is missing or unconfigured. Please configure your API key in the Settings > Secrets panel of Google AI Studio."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints

// 1. Health check & Config status
app.get("/api/config", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasApiKey = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";
  res.json({
    hasApiKey,
    appUrl: process.env.APP_URL || "http://localhost:3000",
  });
});

// 2. Generate Commit Details and Title via Gemini API
app.post("/api/generate", async (req, res) => {
  try {
    const { inputText, format, length, language } = req.body;

    if (!inputText || typeof inputText !== "string" || !inputText.trim()) {
      return res.status(400).json({ error: "Input text is required." });
    }

    const commitFormat = format === "conventional" ? "Conventional" : "Standard";
    const descLength = length || "medium";
    const targetLang = language || "English";

    // Obtain client lazily
    const ai = getGeminiClient();

    const systemInstruction = `You are "CommitCraft", a highly professional Git Commit & Pull Request generator.
Analyze the user's manual change summaries or AI coding assistant outputs.
Determine change intent and categorize the change type strictly into one of: Feature, Fix, Refactor, Documentation, Test, Style, or Chore.

You must generate:
1. A professional Git commit message header.
   - For "Conventional" Commit style, follow the specification: '<type>(<scope>): <subject>' in ALL lowercase subject. If no scope is clear, omit it or deduce a simple module name e.g. 'auth', 'ui', 'api', 'db', 'core'. Lowercase types: feat, fix, refactor, docs, test, style, chore.
   - For "Standard" Commit style, write a high-quality Git commit header beginning with an imperative verb (e.g., "Add", "Fix", "Update", "Refactor", "Implement", "Optimize").
   - Max length 72 characters.
2. A Git commit description body matching the requested length level:
   - "short": 1-2 concise sentences summarizing the overall change.
   - "medium": 3-5 concise sentences summarizing why the change was made and what was changed.
   - "detailed": A comprehensive nested bullet-point summary detailing every single key change of significance.
3. A concise and formal Pull Request Title.
4. A complete, professional, comprehensive Pull Request description.
   - It MUST be written in beautiful, readable Markdown format.
   - Include distinct sections:
     - ### Summary (Briefly outline the purpose of this PR)
     - ### Changes Made (Specific bullet points explaining the modifications)
     - ### Testing Notes (Suggest tests or list test actions)
     - ### Impact (What dependencies, models, or layouts are impacted)

All outputs (commit message, commit description, PR title, PR description) MUST be fully translated or natively generated in the target language: ${targetLang}. Ensure proper grammar, styling, and spelling in ${targetLang}.`;

    const userPrompt = `Generate Git commit messages and pull request descriptions based on the following change log or assistant output:

-------
${inputText}
-------

Style Preference: ${commitFormat} Format
Description Length Preference: ${descLength}
Language Preference: ${targetLang}`;

    console.log(`Sending prompt to Gemini API for language: ${targetLang} in ${commitFormat} format.`);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commitMessage: {
              type: Type.STRING,
              description: "The generated Git commit header/subject line matched to standard/conventional style rules."
            },
            commitDescription: {
              type: Type.STRING,
              description: "The body of the Git commit message matching the description length requirements."
            },
            prTitle: {
              type: Type.STRING,
              description: "The generated concise Pull Request title."
            },
            prDescription: {
              type: Type.STRING,
              description: "The complete, highly structured Markdown PR content including Summary, Changes Made, Testing Notes, and Impact headings."
            },
            commitType: {
              type: Type.STRING,
              description: "The classified type (Feature, Fix, Refactor, Documentation, Test, Style, Chore)."
            }
          },
          required: ["commitMessage", "commitDescription", "prTitle", "prDescription", "commitType"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response output returned from the Gemini API.");
    }

    const rawData = JSON.parse(resultText.trim());

    // Insert into database
    const db = await dbPromise;
    const createdAt = new Date().toISOString();
    const insertResult = await db.run(
      `INSERT INTO generations (createdAt, inputText, commitMessage, commitDescription, prTitle, prDescription, language, commitType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        createdAt,
        inputText,
        rawData.commitMessage,
        rawData.commitDescription,
        rawData.prTitle,
        rawData.prDescription,
        targetLang,
        rawData.commitType,
      ]
    );

    const savedRecord = {
      id: insertResult.lastID,
      createdAt,
      inputText,
      commitMessage: rawData.commitMessage,
      commitDescription: rawData.commitDescription,
      prTitle: rawData.prTitle,
      prDescription: rawData.prDescription,
      language: targetLang,
      commitType: rawData.commitType,
    };

    res.json({ success: true, data: savedRecord });
  } catch (error: any) {
    console.error("Generation error:", error);
    res.status(500).json({ error: error.message || "An internal error occurred during generation." });
  }
});

// 3. Get History
app.get("/api/history", async (req, res) => {
  try {
    const db = await dbPromise;
    const { q } = req.query;

    let rows;
    if (q && typeof q === "string" && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      rows = await db.all(
        `SELECT * FROM generations 
         WHERE inputText LIKE ? OR commitMessage LIKE ? OR commitDescription LIKE ? OR prTitle LIKE ? OR prDescription LIKE ?
         ORDER BY createdAt DESC`,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
      );
    } else {
      rows = await db.all("SELECT * FROM generations ORDER BY createdAt DESC");
    }

    res.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Get history error:", error);
    res.status(500).json({ error: error.message || "Failed to load history." });
  }
});

// 4. Delete From History
app.delete("/api/history", async (req, res) => {
  try {
    const db = await dbPromise;
    const { id } = req.query;

    if (id) {
      // Delete specific item
      await db.run("DELETE FROM generations WHERE id = ?", [id]);
    } else {
      // Clear all items
      await db.run("DELETE FROM generations");
    }

    res.json({ success: true, message: "History modified successfully." });
  } catch (error: any) {
    console.error("Delete history error:", error);
    res.status(500).json({ error: error.message || "Failed to delete from history." });
  }
});

// Setup Vite Dev server or Serve build files
async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production files from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
