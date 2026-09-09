"use client";

import { useState } from "react";
import { updateUserProfile } from "@/actions/user";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
}

export default function UserEditForm({ user }: { user: UserData }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await updateUserProfile(user.id, {
        firstName,
        lastName,
        phone,
      });

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Personal Information
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Update your profile details below.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={50}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={50}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Email Address
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-400">Email address is your account identifier and cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={20}
          placeholder="+1234567890"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Role
        </label>
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {user.role}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
