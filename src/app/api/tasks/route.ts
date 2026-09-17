import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserTasks, createNewTask } from "@/services/taskService";
import { withErrorHandler, UnauthorizedError } from "@/lib/error-handling/errors";

// [OPTING OUT OF CACHING FOR A WHOLE ROUTE]:
// Forces this Route Handler to always execute dynamically on every request (disables Full Route Cache & static optimization).
// Ensures users never receive stale task lists or cached mutations.
export const dynamic = "force-dynamic";

/**
 * GET /api/tasks
 * Fetch all tasks owned by the current authenticated user.
 */
export const GET = withErrorHandler(async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const tasks = await getUserTasks(user.id);
  return NextResponse.json({ success: true, data: tasks }, { status: 200 });
});

/**
 * POST /api/tasks
 * Create a new task assigned to the current authenticated user.
 */
export const POST = withErrorHandler(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const body = await request.json();
  const newTask = await createNewTask(user.id, body);

  return NextResponse.json({ success: true, data: newTask }, { status: 200 });
});
