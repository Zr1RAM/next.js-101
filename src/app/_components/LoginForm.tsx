"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/actions/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calling Server Action from Event Handlers this could directly be called on onClick though that would be ugly
      const result = await loginUser({ email, password });

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Invalid credentials.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome Back
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to view your dashboard.
        </p>

        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-white font-medium transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="flex items-center my-1">
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
          <span className="px-3 text-xs text-zinc-400">or</span>
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>

        <Link
          href="/register"
          className="flex h-10 w-full items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Register
        </Link>
      </form>
    </div>
  );
}