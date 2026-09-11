"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  phone?: string;
}

export async function getUserProfile(userId: string) {
  const currentUser = await getCurrentUser();

  // Enforce access control: user can only view their own profile
  if (!currentUser || currentUser.id !== userId) {
    return { success: false, error: "Unauthorized access: You can only view your own profile." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to load user profile." };
  }
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  const currentUser = await getCurrentUser();

  // Enforce access control: user can only edit their own profile
  if (!currentUser || currentUser.id !== userId) {
    return { success: false, error: "Unauthorized: You can only edit your own details." };
  }

  try {
    const { firstName, lastName, phone } = input;

    if (!firstName?.trim() || !lastName?.trim()) {
      return { success: false, error: "First name and last name are required." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    revalidatePath(`/user/${userId}`);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}
