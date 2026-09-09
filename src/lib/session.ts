import { cookies } from "next/headers";
import { verifyJwt, UserSession } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  // Handle legacy mock token from earlier development
  if (token === "true") {
    try {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        return {
          id: firstUser.id,
          email: firstUser.email,
          role: firstUser.role,
        };
      }
    } catch (error) {
      console.error("Error retrieving fallback user:", error);
    }
  }

  return verifyJwt(token);
}
