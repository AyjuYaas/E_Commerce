"use server";

import { LoginFormType, SignUpFormType } from "@/types/auth.types";
import validatePassword from "@/utils/validatePassword";
import { differenceInYears } from "date-fns";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession, login, logout } from "@/lib/auth";

export async function registerUser({
  name,
  email,
  password,
  dob,
}: SignUpFormType) {
  try {
    if (!name || !email || !password || !dob) {
      return { success: false, error: "All Fields are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { success: false, error: "Email is already registered" };
    }

    const userAge = differenceInYears(new Date(), new Date(dob));
    if (userAge < 13) {
      return {
        success: false,
        error: "You must be at least 13 years old to register.",
      };
    }

    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      return { success: false, error: errors.join(", ") };
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        dob: dob || "",
      },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.log("Failed to Register User: ", error);
    return {
      success: false,
      error: "Something went wrong while registering your account",
    };
  }
}

export async function loginUser({ email, password }: LoginFormType) {
  try {
    if (!email || !password) {
      return { success: false, error: "Fields cannot be empty" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, error: "Invalid credentials" };
    }

    await login({ id: user.id, email: user.email, name: user.name });

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error) {
    console.log("Failed to Login User: ", error);
    return {
      success: false,
      error: "Something went wrong while logging you in",
    };
  }
}

export async function logoutUser() {
  try {
    logout();

    return { success: true, message: "Successfully Logged Out" };
  } catch (error) {
    console.log("Error in logout user: ", error);
    return {
      success: false,
      error: "Something went wrong while logging you out",
    };
  }
}

export async function checkAuth() {
  try {
    const session = await getSession();
    if (!session) return { success: false, user: null };
    return { success: true, user: session.user };
  } catch (error) {
    console.log("Error in checking user: ", error);
    return {
      success: false,
      user: null,
    };
  }
}
