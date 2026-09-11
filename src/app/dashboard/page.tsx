import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { TaskManager } from "./_components/TaskManager";
import { CheckSquare, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Task Dashboard | Next.js 101",
  description: "Manage your personal tasks, priorities, and deadlines.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-zinc-950 text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Task Management
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              Welcome back, <span className="text-zinc-200 font-medium">{user.email}</span>. Track and organize your daily objectives.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Role: {user.role}</span>
            </span>
          </div>
        </div>

        {/* Task Manager Component */}
        <TaskManager />
      </div>
    </main>
  );
}