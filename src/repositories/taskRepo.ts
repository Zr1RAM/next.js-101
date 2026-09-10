import { prisma } from "@/lib/prisma";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: string;
  dueDate?: Date | null;
  dueTime?: string | null;
  userId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: string;
  dueDate?: Date | null;
  dueTime?: string | null;
}

/**
 * Find all tasks owned by a specific user.
 */
export async function findTasksByUserId(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find a specific task by its primary key ID.
 */
export async function findTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

/**
 * Insert a new task into the database.
 */
export async function createTask(data: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "PENDING",
      dueDate: data.dueDate ?? null,
      dueTime: data.dueTime ?? null,
      userId: data.userId,
    },
  });
}

/**
 * Update an existing task in the database.
 */
export async function updateTask(id: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

/**
 * Delete an existing task from the database.
 */
export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}
