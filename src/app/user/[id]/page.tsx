import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getUserProfile } from "@/actions/user";
import UserEditForm from "./UserEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "User Profile | Next.js App",
  description: "View and edit your user profile",
};

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Strict privacy rule: users can view and edit their own details and their details alone
  if (currentUser.id !== id) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm">
            You do not have permission to view or edit this profile. You can only view and edit your own account details.
          </p>
          <div className="mt-5">
            <Link
              href={`/user/${currentUser.id}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Go to Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = await getUserProfile(id);

  if (!result.success || !result.user) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">User Not Found</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            The requested user profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal details and preferences.
        </p>
      </div>

      <UserEditForm user={result.user} />
    </div>
  );
}
