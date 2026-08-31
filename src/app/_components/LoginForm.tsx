"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const defaultUsername = "admin@example.com";
  const defaultPassword = "password123";
  const [email, setEmail] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = "https://your-api-endpoint.com/api/login";
      let apiSuccess = false;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          apiSuccess = true;
        }
      } catch (err) {
        console.warn("API URL is a placeholder. Falling back to local credential check.");
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (apiSuccess || (email === defaultUsername && password === defaultPassword)) {
        // Set the auth token cookie
        document.cookie = "auth_token=true; path=/; max-age=86400; SameSite=Strict";
        
        // Redirect to home and refresh layout to show Nav
        router.push("/");
        router.refresh();
      } else {
        setError(`Invalid credentials.`);
      }
    } catch (err) {
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
      </form>
    </div>
  );
}