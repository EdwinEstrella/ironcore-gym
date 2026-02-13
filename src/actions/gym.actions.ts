"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Gym } from "@prisma/client";

// Tipos para las acciones
export interface UpdateGymInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export interface GymResult {
  success: boolean;
  message: string;
  data?: Gym;
  error?: string;
}

/**
 * Obtener información de un gimnasio por ID
 */
export async function getGymById(gymId: string) {
  try {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: {
        _count: {
          select: {
            users: true,
            members: {
              where: {
                status: "ACTIVE",
              },
            },
            plans: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!gym) {
      return {
        success: false,
        message: "Gimnasio no encontrado",
      };
    }

    return {
      success: true,
      data: gym,
    };
  } catch (error) {
    console.error("Error en getGymById:", error);
    return {
      success: false,
      message: "Error al obtener el gimnasio",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Actualizar información de un gimnasio
 */
export async function updateGym(data: UpdateGymInput): Promise<GymResult> {
  try {
    // Verificar que el gimnasio existe
    const existingGym = await prisma.gym.findUnique({
      where: { id: data.id },
    });

    if (!existingGym) {
      return {
        success: false,
        message: "Gimnasio no encontrado",
      };
    }

    // Si se actualiza el email, verificar que no esté duplicado
    if (data.email && data.email !== existingGym.email) {
      const duplicateGym = await prisma.gym.findUnique({
        where: { email: data.email },
      });

      if (duplicateGym) {
        return {
          success: false,
          message: "Ya existe un gimnasio con ese email",
        };
      }
    }

    const gym = await prisma.gym.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        logo: data.logo,
      },
    });

    revalidatePath(`/settings`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Gimnasio actualizado correctamente",
      data: gym,
    };
  } catch (error) {
    console.error("Error en updateGym:", error);
    return {
      success: false,
      message: "Error al actualizar el gimnasio",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener estadísticas generales del gimnasio
 */
export async function getGymStats(gymId: string) {
  try {
    const [
      gym,
      activeMembers,
      totalPlans,
      activeSubscriptions,
      paidSubscriptionsCount,
    ] = await Promise.all([
      prisma.gym.findUnique({
        where: { id: gymId },
        select: {
          _count: {
            select: {
              users: true,
              members: true,
              plans: true,
            },
          },
        },
      }),
      prisma.member.count({ where: { gymId } }),
      prisma.member.count({ where: { gymId, status: "ACTIVE" } }),
      prisma.plan.count({ where: { gymId, isActive: true } }),
      prisma.subscription.count({
        where: {
          member: { gymId },
          status: "ACTIVE",
        },
      }),
      // Ingresos del mes actual
      // Ingresos del mes actual - contar suscripciones pagadas (requiere unión con plan)
      prisma.subscription.count({
        where: {
          member: { gymId },
          paymentStatus: "PAID",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalMembers: gym?._count.members || 0,
        activeMembers,
        totalUsers: gym?._count.users || 0,
        totalPlans,
        activeSubscriptions,
        paidThisMonth: paidSubscriptionsCount,
      },
    };
  } catch (error) {
    console.error("Error en getGymStats:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
