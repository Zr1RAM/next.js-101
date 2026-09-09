"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signJwt } from "@/lib/auth";

export interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  userId?: string;
}

export async function registerUser(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResponse> {
  try {
    const { firstName, lastName, email, password, phone } = formData;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: "Please provide a valid email address." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return { success: false, error: "A user with this email already exists." };
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Create user in Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        role: "CUSTOMER",
        password: hashedPassword,
      },
    });

    // Generate JWT
    const token = await signJwt({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "strict",
      httpOnly: false,
    });

    return { success: true, token, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register.",
    };
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.password) {
      return { success: false, error: "Invalid email or password." };
    }

    // Compare with bcrypt
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    // Generate JWT
    const token = await signJwt({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "strict",
      httpOnly: false,
    });

    return { success: true, token, userId: user.id };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in.",
    };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
