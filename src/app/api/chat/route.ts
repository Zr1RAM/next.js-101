import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, stepCountIs, convertToModelMessages, generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { buildSystemPrompt } from "./prompts/master-prompt";
import { isRateLimitOrQuotaError, CHAT_LIMIT_REACHED_MESSAGE } from "@/lib/chat-utils";

export const maxDuration = 45;

// ==============================================================================
// 1. In-Memory Pre-Warmed Singletons (Zero Disk I/O & Zero Re-Allocation on POST)
// ==============================================================================

let cachedManual: string | null = null;
let cachedSystemPrompt: string | null = null;
let cachedGoogleProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

function getKnowledgeBase(): string {
  if (cachedManual) return cachedManual;
  try {
    const knowledgeDir = path.join(process.cwd(), "data", "knowledge");
    const contents: string[] = [];

    if (fs.existsSync(knowledgeDir)) {
      const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));
      for (const file of files) {
        const filePath = path.join(knowledgeDir, file);
        const text = fs.readFileSync(filePath, "utf-8");
        contents.push(`\n=== SOURCE: ${file} ===\n${text}`);
      }
    }

    const legacyDocPath = path.join(process.cwd(), "data", "nextjs-expert-manual.md");
    if (fs.existsSync(legacyDocPath)) {
      contents.push(`\n=== SOURCE: nextjs-expert-manual.md ===\n${fs.readFileSync(legacyDocPath, "utf-8")}`);
    }

    cachedManual = contents.length > 0 ? contents.join("\n\n") : "Next.js 16 App Router reference guide.";
  } catch (err) {
    console.error("Failed to load knowledge manual:", err);
    cachedManual = "Next.js 16 App Router reference.";
  }
  return cachedManual;
}

function getSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const manual = getKnowledgeBase();
  cachedSystemPrompt = buildSystemPrompt(manual);
  return cachedSystemPrompt;
}

function getGoogleProvider(apiKey: string) {
  if (cachedGoogleProvider) return cachedGoogleProvider;
  cachedGoogleProvider = createGoogleGenerativeAI({ apiKey });
  return cachedGoogleProvider;
}

// ==============================================================================
// 2. Autonomous GitHub Tools (Pre-Allocated Module Constant)
// ==============================================================================

const chatTools = {
  fetchGitHubRepoContents: tool({
    description: "Fetch file contents, directory listing, or tree structure from any public GitHub repository.",
    inputSchema: z.object({
      owner: z.string().describe("GitHub username or organization (e.g. 'vercel')"),
      repo: z.string().describe("Repository name (e.g. 'next.js')"),
      path: z.string().optional().default("").describe("Path to file or folder. Omit or empty for root directory."),
    }),
    execute: async ({ owner, repo, path: filePath }: { owner: string; repo: string; path: string }) => {
      try {
        const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath ? encodeURIComponent(filePath) : ""}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NextJs-Architect-Agent",
          },
          next: { revalidate: 3600 }, // [DATA CACHE]: Caches public GitHub repo responses across users for 1 hour
        });

        if (!res.ok) {
          return `Error fetching GitHub repository contents (${res.status} ${res.statusText})`;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          return JSON.stringify(
            data.slice(0, 30).map((item: any) => ({
              name: item.name,
              type: item.type,
              path: item.path,
              size: item.size,
            }))
          );
        } else if (data.content && data.encoding === "base64") {
          const decoded = Buffer.from(data.content, "base64").toString("utf-8");
          return decoded.slice(0, 4000);
        }
        return JSON.stringify(data);
      } catch (err: any) {
        return `Failed to fetch GitHub repo contents: ${err.message}`;
      }
    },
  }),

  fetchGitHubCommits: tool({
    description: "Fetch recent commits from a public GitHub repository to inspect recent release changes or commit messages.",
    inputSchema: z.object({
      owner: z.string().describe("GitHub username or organization (e.g. 'vercel')"),
      repo: z.string().describe("Repository name (e.g. 'next.js')"),
      count: z.number().optional().default(5).describe("Number of commits to fetch (1-10)"),
    }),
    execute: async ({ owner, repo, count }: { owner: string; repo: string; count: number }) => {
      try {
        const perPage = Math.min(Math.max(count || 5, 1), 10);
        const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=${perPage}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NextJs-Architect-Agent",
          },
          next: { revalidate: 600 }, // [DATA CACHE]: Caches recent commits across users for 10 minutes
        });

        if (!res.ok) {
          return `Error fetching GitHub commits (${res.status} ${res.statusText})`;
        }

        const data = await res.json();
        return JSON.stringify(
          data.map((c: any) => ({
            sha: c.sha ? c.sha.substring(0, 7) : "",
            message: c.commit?.message?.split("\n")[0] || "",
            author: c.commit?.author?.name || "Unknown",
            date: c.commit?.author?.date || "",
          }))
        );
      } catch (err: any) {
        return `Failed to fetch GitHub commits: ${err.message}`;
      }
    },
  }),
};

// ==============================================================================
// 3. HTTP POST Handler (Pure Stream Execution)
// ==============================================================================

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing GEMINI_API_KEY in .env. Please add your Google Gemini API key to .env or .env.local (get one free at https://aistudio.google.com/).",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Re-use pre-warmed singletons directly from server RAM
    const google = getGoogleProvider(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const systemPrompt = getSystemPrompt();

    // Convert client UIMessages (with parts array) to ModelMessages (with content string/array)
    const modelMessages =
      Array.isArray(messages) && messages.length > 0 && "parts" in messages[0]
        ? await convertToModelMessages(messages)
        : messages;

    const result = streamText({
      model: google(modelName),
      system: systemPrompt,
      messages: modelMessages,
      stopWhen: stepCountIs(4),
      tools: chatTools,
    });

    // Stream Responses
    return result.toUIMessageStreamResponse({
      onError(err) {
        if (isRateLimitOrQuotaError(err)) {
          return CHAT_LIMIT_REACHED_MESSAGE;
        }
        return err instanceof Error ? err.message : "An unexpected error occurred in the chat handler.";
      },
    });
  } catch (error: any) {
    if (isRateLimitOrQuotaError(error)) {
      return new Response(
        JSON.stringify({
          error: CHAT_LIMIT_REACHED_MESSAGE,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.error("Error in /api/chat route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred in the chat handler." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// ==============================================================================
// 4. Dynamic Prompt Suggestions Generator (Random 4-8 Topics via LLM)
// ==============================================================================

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          "Explain how Intercepting Routes work in Next.js with an example",
          "What is the difference between Server and Client Components?",
          "Fetch recent commits on vercel/next.js to check latest changes",
          "How does default.tsx work in Parallel Routes?",
        ],
      });
    }

    const google = getGoogleProvider(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    // Random count between 4 and 8
    const count = Math.floor(Math.random() * 5) + 4;

    const { object } = await generateObject({
      model: google(modelName),
      schema: z.object({
        suggestions: z
          .array(z.string())
          .describe(`List of exactly ${count} diverse and realistic Next.js questions`),
      }),
      prompt: `You are a prompt recommendation engine. Generate exactly ${count} random, diverse, and practical questions that a developer would ask a Senior Next.js 16 Enterprise Architect.
Cover varied topics like: Parallel Routes (@slot), Intercepting Routes ((.)[slug]), Server Actions with useOptimistic, proxy.ts middleware auth, React Server Components vs Client Components, dynamic caching/revalidate, GitHub repository inspection, and Prisma migrations.
Make each question concise and punchy (under 12 words). Do not number them.`,
    });

    return NextResponse.json(
      { suggestions: object.suggestions },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    if (isRateLimitOrQuotaError(error)) {
      console.warn("Gemini quota/rate limit reached during dynamic prompt suggestions generation. Using default topics.");
    } else {
      console.error("Failed to generate dynamic prompt suggestions:", error);
    }
    // Graceful fallback suggestions
    return NextResponse.json({
      suggestions: [
        "Explain how Intercepting Routes work in Next.js with an example",
        "What is the difference between Server and Client Components?",
        "Fetch recent commits on vercel/next.js to check latest changes",
        "How does default.tsx work in Parallel Routes?",
        "How do Server Actions work with useOptimistic for immediate UI updates?",
      ],
    });
  }
}
