import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  getTaskDetails,
  updateUserTask,
  removeUserTask,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "@/services/taskService";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Helper to map service errors to HTTP responses.
 */
function handleServiceError(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  const message = error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * GET /api/tasks/[id]
 * Fetch a single task by ID for the authenticated user.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const task = await getTaskDetails(id, user.id);

    return NextResponse.json(task, { status: 200 });
  } catch (error: unknown) {
    return handleServiceError(error);
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update an existing task's title, description, status, or due date/time.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const updatedTask = await updateUserTask(id, user.id, body);

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: unknown) {
    return handleServiceError(error);
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a specific task owned by the authenticated user.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await removeUserTask(id, user.id);

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error: unknown) {
    return handleServiceError(error);
  }
}
