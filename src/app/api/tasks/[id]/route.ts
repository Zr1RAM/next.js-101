import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getTaskDetails,
  updateUserTask,
  removeUserTask,
} from "@/services/taskService";
import {
  withErrorHandler,
  BadRequestError,
  UnauthorizedError,
} from "@/lib/error-handling/errors";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/[id]
 * Fetch a single task by ID for the authenticated user.
 */
export const GET = withErrorHandler(
  async (request: Request, context: RouteContext) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { id } = await context.params;
    if (!id) {
      throw new BadRequestError("Missing ID");
    }

    const task = await getTaskDetails(id, user.id);
    return NextResponse.json({ success: true, data: task }, { status: 200 });
  }
);

/**
 * PATCH /api/tasks/[id]
 * Update an existing task's title, description, status, or due date/time.
 */
export const PATCH = withErrorHandler(
  async (request: Request, context: RouteContext) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { id } = await context.params;
    if (!id) {
      throw new BadRequestError("Missing ID");
    }

    const body = await request.json();
    const updatedTask = await updateUserTask(id, user.id, body);

    return NextResponse.json(
      { success: true, data: updatedTask },
      { status: 200 }
    );
  }
);

/**
 * DELETE /api/tasks/[id]
 * Delete a specific task owned by the authenticated user.
 */
export const DELETE = withErrorHandler(
  async (request: Request, context: RouteContext) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { id } = await context.params;
    if (!id) {
      throw new BadRequestError("Missing ID");
    }

    await removeUserTask(id, user.id);
    return NextResponse.json({ success: true, data: { id } }, { status: 200 });
  }
);
