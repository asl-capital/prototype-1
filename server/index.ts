import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI configuration — key is read from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

// Model fallback chain: try each in order
const MODEL_FALLBACK_CHAIN = ["gpt-4.1-mini", "gpt-4o", "gpt-4-turbo"];

async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  model: string
): Promise<{ ok: boolean; data?: any; status?: number; errorText?: string }> {
  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { ok: false, status: response.status, errorText };
  }

  const data = await response.json();
  return { ok: true, data };
}

async function callWithFallback(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  for (const model of MODEL_FALLBACK_CHAIN) {
    console.log(`Trying model: ${model}`);
    const result = await callOpenAI(messages, model);
    if (result.ok) {
      console.log(`Success with model: ${model}`);
      return result.data.choices?.[0]?.message?.content || "";
    }
    // If model not found (404) or invalid model error, try next
    console.warn(`Model ${model} failed (${result.status}): ${result.errorText?.slice(0, 200)}`);
    if (result.status !== 404 && !result.errorText?.includes("model")) {
      // Non-model error (rate limit, auth, etc.) — don't fallback
      throw new Error(`OpenAI API error ${result.status}: ${result.errorText}`);
    }
  }
  throw new Error("All models in fallback chain failed");
}

// Content moderation check
async function moderateContent(text: string): Promise<{ flagged: boolean; categories?: string[] }> {
  try {
    const response = await fetch(`${OPENAI_BASE_URL}/moderations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input: text }),
    });
    if (!response.ok) return { flagged: false };
    const data = await response.json();
    const result = data.results?.[0];
    if (result?.flagged) {
      const flaggedCategories = Object.entries(result.categories || {})
        .filter(([_, v]) => v)
        .map(([k]) => k);
      return { flagged: true, categories: flaggedCategories };
    }
    return { flagged: false };
  } catch {
    return { flagged: false };
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // OpenAI chat endpoint with moderation
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemPrompt } = req.body;

      // Moderation check on the latest user message
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
      if (lastUserMsg) {
        const modResult = await moderateContent(lastUserMsg.content);
        if (modResult.flagged) {
          console.warn("Content flagged by moderation:", modResult.categories);
          res.json({
            content: "أقدر تواصلك معي. أنا هنا فقط لمساعدتك في رحلة التمويل العقاري مع أصل. كيف أقدر أساعدك؟",
            moderated: true,
          });
          return;
        }
      }

      const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
      ];

      const content = await callWithFallback(fullMessages);
      res.json({ content });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve static files from dist/public in production
  // In production: server bundle is at dist/index.js, so __dirname = dist/
  // In dev: server runs from server/ directory, static files at dist/public/
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
