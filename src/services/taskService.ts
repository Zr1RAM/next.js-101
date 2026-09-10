import {
  findTasksByUserId,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "@/repositories/taskRepo";

const VALID_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
export type TaskStatus = (typeof VALID_STATUSES)[number];

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: string;
  dueDate?: string | null; // ISO string e.g. "2026-09-15"
  dueTime?: string | null; // e.g. "14:30"
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  status?: string;
  dueDate?: string | null;
  dueTime?: string | null;
}

/**
 * Custom error class for business rule validation failures.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Custom error class for authorization failures.
 */
export class ForbiddenError extends Error {
  constructor(message: string = "You do not have permission to access this task") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Custom error class for entity not found.
 */
export class NotFoundError extends Error {
  constructor(message: string = "Task not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Retrieve all tasks for the given user.
 */
export async function getUserTasks(userId: string) {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }
  return findTasksByUserId(userId);
}

/**
 * Retrieve a single task by ID, enforcing user ownership.
 */
export async function getTaskDetails(taskId: string, userId: string) {
  if (!taskId) throw new ValidationError("Task ID is required");
  if (!userId) throw new ValidationError("User ID is required");

  const task = await findTaskById(taskId);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.userId !== userId) {
    throw new ForbiddenError("You do not have access to this task");
  }

  return task;
}

/**
 * Validate and create a new task for the authenticated user.
 */
export async function createNewTask(userId: string, data: CreateTaskDTO) {
  if (!userId) throw new ValidationError("User ID is required");

  const trimmedTitle = data.title?.trim();
  if (!trimmedTitle) {
    throw new ValidationError("Title is required and cannot be empty");
  }

  if (trimmedTitle.length > 200) {
    throw new ValidationError("Title cannot exceed 200 characters");
  }

  let validatedStatus = "PENDING";
  if (data.status) {
    const uppercaseStatus = data.status.toUpperCase();
    if (!VALID_STATUSES.includes(uppercaseStatus as TaskStatus)) {
      throw new ValidationError(
        `Invalid status '${data.status}'. Must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }
    validatedStatus = uppercaseStatus;
  }

  let parsedDueDate: Date | null = null;
  if (data.dueDate) {
    const d = new Date(data.dueDate);
    if (isNaN(d.getTime())) {
      throw new ValidationError("Invalid due date format. Expected valid date string.");
    }
    parsedDueDate = d;
  }

  let validatedDueTime: string | null = null;
  if (data.dueTime) {
    const trimmedTime = data.dueTime.trim();
    if (trimmedTime.length > 10) {
      throw new ValidationError("Due time cannot exceed 10 characters (e.g., '14:30')");
    }
    validatedDueTime = trimmedTime;
  }

  return createTask({
    title: trimmedTitle,
    description: data.description?.trim() || null,
    status: validatedStatus,
    dueDate: parsedDueDate,
    dueTime: validatedDueTime,
    userId,
  });
}

/**
 * Validate and update an existing task, ensuring user ownership.
 */
export async function updateUserTask(taskId: string, userId: string, data: UpdateTaskDTO) {
  // Ensure the task exists and is owned by this user
  await getTaskDetails(taskId, userId);

  const updatePayload: {
    title?: string;
    description?: string | null;
    status?: string;
    dueDate?: Date | null;
    dueTime?: string | null;
  } = {};

  if (data.title !== undefined) {
    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("Title cannot be empty");
    }
    if (trimmedTitle.length > 200) {
      throw new ValidationError("Title cannot exceed 200 characters");
    }
    updatePayload.title = trimmedTitle;
  }

  if (data.description !== undefined) {
    updatePayload.description = data.description ? data.description.trim() : null;
  }

  if (data.status !== undefined) {
    const uppercaseStatus = data.status.toUpperCase();
    if (!VALID_STATUSES.includes(uppercaseStatus as TaskStatus)) {
      throw new ValidationError(
        `Invalid status '${data.status}'. Must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }
    updatePayload.status = uppercaseStatus;
  }

  if (data.dueDate !== undefined) {
    if (data.dueDate === null || data.dueDate === "") {
      updatePayload.dueDate = null;
    } else {
      const d = new Date(data.dueDate);
      if (isNaN(d.getTime())) {
        throw new ValidationError("Invalid due date format.");
      }
      updatePayload.dueDate = d;
    }
  }

  if (data.dueTime !== undefined) {
    if (data.dueTime === null || data.dueTime === "") {
      updatePayload.dueTime = null;
    } else {
      const trimmedTime = data.dueTime.trim();
      if (trimmedTime.length > 10) {
        throw new ValidationError("Due time cannot exceed 10 characters");
      }
      updatePayload.dueTime = trimmedTime;
    }
  }

  return updateTask(taskId, updatePayload);
}

/**
 * Delete a task after verifying ownership.
 */
export async function removeUserTask(taskId: string, userId: string) {
  // Ensure the task exists and is owned by this user
  await getTaskDetails(taskId, userId);
  return deleteTask(taskId);
}
