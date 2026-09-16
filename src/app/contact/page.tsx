"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { isRateLimitOrQuotaError, CHAT_LIMIT_REACHED_MESSAGE } from "@/lib/chat-utils";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden text-zinc-100 font-mono text-xs shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950/70 border-b border-zinc-800 text-[11px] text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-blue-400">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
        >
          {copied ? (
            <>
              <span className="text-emerald-400">✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Parses raw markdown into text segments and code blocks
function FormattedMessage({ content }: { content: string }) {
  const parts: (string | { type: "code"; code: string; lang: string })[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    parts.push({
      type: "code",
      lang: match[1] || "tsx",
      code: match[2].trim(),
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return (
    <div className="space-y-2 text-sm sm:text-base leading-relaxed break-words">
      {parts.map((part, index) => {
        if (typeof part === "object" && part.type === "code") {
          return <CodeBlock key={index} code={part.code} language={part.lang} />;
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {typeof part === "string" ? part : ""}
          </p>
        );
      })}
    </div>
  );
}

export default function ContactChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat(); // messages handles stream-reading, chunk-decoding, or buffer-stitching logic
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setIsLoadingSuggestions(true);
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setPromptSuggestions(data.suggestions);
        }
      }
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Fetch random suggestions from LLM on page load
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSuggestionClick = (prompt: string) => {
    if (status === "streaming") return;
    setInput("");
    sendMessage({ text: prompt });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    const textToSend = input;
    setInput("");
    sendMessage({ text: textToSend });
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-blue-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span>Next.js Architect AI</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  RAG + GitHub Agent
                </span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Specialized Senior Enterprise Architect trained on modern Next.js 16 App Router
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/marketing"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Marketing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-between">
        {/* Messages Feed */}
        <div className="flex-1 space-y-6 mb-8">
          {messages.length === 0 && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold mb-4">
                🤖
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Senior Next.js Production Consultant
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
                Ask architectural questions about React Server Components, Intercepting Routes,
                Parallel Routes, Server Actions, or inspect public GitHub repositories.
              </p>

              {/* Starter Prompt Chips Header & Controls */}
              <div className="mt-8 w-full max-w-2xl flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Suggested Topics ({promptSuggestions.length || "..."})
                </span>
                <button
                  type="button"
                  onClick={fetchSuggestions}
                  disabled={isLoadingSuggestions}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 transition-opacity"
                >
                  <span className={isLoadingSuggestions ? "animate-spin" : ""}>↻</span>
                  <span>{isLoadingSuggestions ? "Generating..." : "Shuffle Topics"}</span>
                </button>
              </div>

              {/* Starter Prompt Chips Grid */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {isLoadingSuggestions && promptSuggestions.length === 0 ? (
                  // Skeleton Placeholders
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-zinc-200/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 animate-pulse h-[76px]"
                    />
                  ))
                ) : (
                  promptSuggestions.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestionClick(prompt)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-xs text-zinc-700 dark:text-zinc-300 shadow-sm group"
                    >
                      <span className="text-blue-500 font-semibold block mb-1">Topic #{i + 1}</span>
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {prompt}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Render Active Messages */}
          {messages.map((m) => {
            const textParts = m.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("\n") || "";

            const toolParts = m.parts?.filter((p) => p.type.includes("tool")) || [];

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0 mt-1">
                    AI
                  </div>
                )}

                {/* Message Content Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-2xl rounded-3xl px-5 py-4 shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/10 dark:border-zinc-800 text-[11px] font-semibold opacity-70">
                    <span>{m.role === "user" ? "You" : "Next.js Senior Architect"}</span>
                  </div>

                  {textParts && <FormattedMessage content={textParts} />}

                  {/* Render Tool Invocations if any */}
                  {toolParts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                      {toolParts.map((tool: any, tIdx) => (
                        <div
                          key={tIdx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300"
                        >
                          <span className="text-blue-500">⚙️ Tool:</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {tool.toolName || "GitHub Fetcher"}
                          </span>
                          {tool.state === "result" ? (
                            <span className="text-emerald-500 text-[11px]">✓ executed</span>
                          ) : (
                            <span className="text-amber-500 text-[11px] animate-pulse">
                              running...
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center text-xs font-bold shadow-sm shrink-0 mt-1">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing/Loading Status */}
          {status === "submitted" && (
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pl-12 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Architect is querying knowledge base and streaming response...</span>
            </div>
          )}

          {/* Error Banner / Quota Limit Notice */}
          {error && (() => {
            if (isRateLimitOrQuotaError(error)) {
              return (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0 mt-1">
                    AI
                  </div>
                  <div className="max-w-[85%] sm:max-w-2xl rounded-3xl rounded-bl-md px-5 py-4 shadow-sm bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                      <span>Next.js Senior Architect</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full font-medium">
                        Quota Exceeded
                      </span>
                    </div>
                    <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
                      {CHAT_LIMIT_REACHED_MESSAGE}
                    </p>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      The Gemini API quota for this period has been exhausted. Please wait a short while before sending another query.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs max-w-xl mx-auto flex items-start gap-3">
                <span className="text-base">⚠️</span>
                <div>
                  <p className="font-semibold">Chat stream error</p>
                  <p className="mt-1 opacity-90">{error.message}</p>
                  <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Ensure your <code className="font-mono text-zinc-700 dark:text-zinc-300">GEMINI_API_KEY</code> is set in <code className="font-mono text-zinc-700 dark:text-zinc-300">.env</code>.
                  </p>
                </div>
              </div>
            );
          })()}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="sticky bottom-4 z-20 pt-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl focus-within:border-blue-500/60 transition-all"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Next.js Architect (e.g. 'Compare App Router vs Pages Router')..."
              className="flex-1 px-4 py-3 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "streaming" || !input.trim()}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {status === "streaming" ? "Streaming..." : "Send →"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
