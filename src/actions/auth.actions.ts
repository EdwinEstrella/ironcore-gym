"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signIn } from "next-auth/react";
import { revalidatePath } from "next/cache";

// Tipos para las acciones
export interface RegisterInput {
  gymName: string;
  gymEmail: string;
  gymPhone?: string;
  gymAddress?: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Registrar un nuevo gimnasio y usuario administrador
 */
export async function registerGym(data: RegisterInput): Promise<AuthResult> {
  try {
    // Verificar si ya existe un gimnasio con ese email
    const existingGym = await prisma.gym.findUnique({
      where: { email: data.gymEmail },
    });

    if (existingGym) {
      return {
        success: false,
        message: "Ya existe un gimnasio con ese email",
      };
    }

    // Verificar si el email de usuario ya existe en algún gimnasio
    const existingUser = await prisma.gymUser.findFirst({
      where: { email: data.userEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Ya existe un usuario con ese email",
      };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.userPassword, 10);

    // Crear gimnasio y usuario en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear gimnasio
      const gym = await tx.gym.create({
        data: {
          name: data.gymName,
          email: data.gymEmail,
          phone: data.gymPhone,
          address: data.gymAddress,
        },
      });

      // Crear usuario administrador
      const user = await tx.gymUser.create({
        data: {
          email: data.userEmail,
          name: data.userName,
          password: hashedPassword,
          role: "OWNER",
          gymId: gym.id,
        },
      });

      return { gym, user };
    });

    revalidatePath("/login");

    return {
      success: true,
      message: "Gimnasio registrado correctamente. Ya puedes iniciar sesión.",
    };
  } catch (error) {
    console.error("Error en registerGym:", error);
    return {
      success: false,
      message: "Error al registrar el gimnasio",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Iniciar sesión
 */
export async function login(data: LoginInput): Promise<AuthResult> {
  try {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      return {
        success: false,
        message: "Credenciales inválidas",
        error: res.error,
      };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Sesión iniciada correctamente",
    };
  } catch (error) {
    console.error("Error en login:", error);
    return {
      success: false,
      message: "Error al iniciar sesión",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener sesión actual del servidor
 */
export async function getSession() {
  // Esta función se usará en server components para obtener la sesión
  // Se implementará después de crear el helper de sesión
  return null;
}
