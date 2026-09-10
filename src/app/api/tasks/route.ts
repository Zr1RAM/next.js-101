import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  getUserTasks,
  createNewTask,
  ValidationError,
} from "@/services/taskService";

/**
 * GET /api/tasks
 * Fetch all tasks owned by the current authenticated user.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await getUserTasks(user.id);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Create a new task assigned to the current authenticated user.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newTask = await createNewTask(user.id, body);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
