import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure client is re-instantiated in dev mode if cached instance lacks new models (e.g. task)
export const prisma =
  globalForPrisma.prisma && "task" in globalForPrisma.prisma
    ? globalForPrisma.prisma
    : new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
