"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/actions/auth";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Failed to create account.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <form
        onSubmit={handleRegister}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Create an Account
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Register to access your dashboard and profile.
        </p>

        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              maxLength={50}
              placeholder="John"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              maxLength={50}
              placeholder="Doe"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={150}
            placeholder="john@example.com"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Phone Number <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            placeholder="+1234567890"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 pr-10 pl-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 pr-10 pl-3 py-2 text-sm bg-transparent text-black dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-white font-medium transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
