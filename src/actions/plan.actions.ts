"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Plan, Subscription, SubscriptionStatus, PaymentStatus, Prisma } from "@prisma/client";

// Tipos para las acciones
export interface CreatePlanInput {
  gymId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  maxUsers?: number;
  features?: string[];
}

export interface UpdatePlanInput {
  id: string;
  gymId: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  maxUsers?: number;
  features?: string[];
  isActive?: boolean;
}

export interface CreateSubscriptionInput {
  gymId: string;
  memberId: string;
  planId: string;
  startDate?: Date;
  duration?: number;
  notes?: string;
}

export interface PlanResult {
  success: boolean;
  message: string;
  data?: Plan;
  error?: string;
}

export interface SubscriptionResult {
  success: boolean;
  message: string;
  data?: Subscription;
  error?: string;
}

/**
 * Obtener todos los planes de un gimnasio
 */
export async function getPlans(gymId: string, includeInactive: boolean = false) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        gymId,
        isActive: includeInactive ? undefined : true,
      },
      include: {
        _count: {
          select: {
            subscriptions: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    console.error("Error en getPlans:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener un plan por ID
 */
export async function getPlanById(id: string, gymId: string) {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        id,
        gymId,
      },
      include: {
        subscriptions: {
          include: {
            member: true,
          },
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    if (!plan) {
      return {
        success: false,
        message: "Plan no encontrado",
      };
    }

    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Error en getPlanById:", error);
    return {
      success: false,
      message: "Error al obtener el plan",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crear un nuevo plan
 */
export async function createPlan(data: CreatePlanInput): Promise<PlanResult> {
  try {
    // Verificar que el gimnasio existe
    const gym = await prisma.gym.findUnique({
      where: { id: data.gymId },
    });

    if (!gym) {
      return {
        success: false,
        message: "Gimnasio no encontrado",
      };
    }

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        maxUsers: data.maxUsers,
        features: data.features as Prisma.JsonArray,
        gymId: data.gymId,
      },
    });

    revalidatePath(`/plans`);
    revalidatePath(`/settings`);

    return {
      success: true,
      message: "Plan creado correctamente",
      data: plan,
    };
  } catch (error) {
    console.error("Error en createPlan:", error);
    return {
      success: false,
      message: "Error al crear el plan",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Actualizar un plan
 */
export async function updatePlan(data: UpdatePlanInput): Promise<PlanResult> {
  try {
    // Verificar que el plan existe y pertenece al gimnasio
    const existingPlan = await prisma.plan.findFirst({
      where: {
        id: data.id,
        gymId: data.gymId,
      },
    });

    if (!existingPlan) {
      return {
        success: false,
        message: "Plan no encontrado",
      };
    }

    const plan = await prisma.plan.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        maxUsers: data.maxUsers,
        features: data.features as Prisma.JsonArray,
        isActive: data.isActive,
      },
    });

    revalidatePath(`/plans`);
    revalidatePath(`/plans/${data.id}`);
    revalidatePath(`/settings`);

    return {
      success: true,
      message: "Plan actualizado correctamente",
      data: plan,
    };
  } catch (error) {
    console.error("Error en updatePlan:", error);
    return {
      success: false,
      message: "Error al actualizar el plan",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Eliminar un plan (soft delete - desactivar)
 */
export async function deletePlan(id: string, gymId: string): Promise<PlanResult> {
  try {
    // Verificar que el plan existe y pertenece al gimnasio
    const existingPlan = await prisma.plan.findFirst({
      where: {
        id,
        gymId,
      },
    });

    if (!existingPlan) {
      return {
        success: false,
        message: "Plan no encontrado",
      };
    }

    // Verificar que no haya suscripciones activas
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        planId: id,
        status: "ACTIVE",
      },
    });

    if (activeSubscriptions > 0) {
      return {
        success: false,
        message: "No se puede eliminar un plan con suscripciones activas",
      };
    }

    // Soft delete - desactivar
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    revalidatePath(`/plans`);
    revalidatePath(`/settings`);

    return {
      success: true,
      message: "Plan eliminado correctamente",
      data: plan,
    };
  } catch (error) {
    console.error("Error en deletePlan:", error);
    return {
      success: false,
      message: "Error al eliminar el plan",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener todas las suscripciones de un gimnasio
 */
export async function getSubscriptions(gymId: string, status?: SubscriptionStatus) {
  try {
    const where: { member: { gymId: string }; status?: SubscriptionStatus } = {
      member: { gymId },
    };

    if (status) {
      where.status = status;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        member: true,
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error) {
    console.error("Error en getSubscriptions:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crear una nueva suscripción para un miembro
 */
export async function createSubscription(data: CreateSubscriptionInput): Promise<SubscriptionResult> {
  try {
    // Verificar que el miembro existe y pertenece al gimnasio
    const member = await prisma.member.findFirst({
      where: {
        id: data.memberId,
        gymId: data.gymId,
      },
    });

    if (!member) {
      return {
        success: false,
        message: "Miembro no encontrado",
      };
    }

    // Verificar que el plan existe y pertenece al gimnasio
    const plan = await prisma.plan.findFirst({
      where: {
        id: data.planId,
        gymId: data.gymId,
        isActive: true,
      },
    });

    if (!plan) {
      return {
        success: false,
        message: "Plan no encontrado o inactivo",
      };
    }

    // Calcular fecha de fin
    const startDate = data.startDate || new Date();
    const duration = data.duration || plan.duration;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    // Desactivar suscripciones anteriores del miembro
    await prisma.subscription.updateMany({
      where: {
        memberId: data.memberId,
        status: "ACTIVE",
      },
      data: {
        status: "EXPIRED",
      },
    });

    // Crear nueva suscripción
    const subscription = await prisma.subscription.create({
      data: {
        memberId: data.memberId,
        planId: data.planId,
        startDate,
        endDate,
        status: "ACTIVE",
        paymentStatus: "PENDING",
        notes: data.notes,
      },
      include: {
        member: true,
        plan: true,
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/members/${data.memberId}`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Suscripción creada correctamente",
      data: subscription,
    };
  } catch (error) {
    console.error("Error en createSubscription:", error);
    return {
      success: false,
      message: "Error al crear la suscripción",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Cancelar una suscripción
 */
export async function cancelSubscription(id: string, gymId: string): Promise<SubscriptionResult> {
  try {
    // Verificar que la suscripción existe y pertenece al gimnasio
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        member: { gymId },
      },
      include: {
        member: true,
      },
    });

    if (!subscription) {
      return {
        success: false,
        message: "Suscripción no encontrada",
      };
    }

    // Cancelar suscripción
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/members/${subscription.memberId}`);

    return {
      success: true,
      message: "Suscripción cancelada correctamente",
      data: updatedSubscription,
    };
  } catch (error) {
    console.error("Error en cancelSubscription:", error);
    return {
      success: false,
      message: "Error al cancelar la suscripción",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Actualizar estado de pago de una suscripción
 */
export async function updateSubscriptionPayment(
  id: string,
  gymId: string,
  paymentStatus: PaymentStatus
): Promise<SubscriptionResult> {
  try {
    // Verificar que la suscripción existe y pertenece al gimnasio
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        member: { gymId },
      },
    });

    if (!subscription) {
      return {
        success: false,
        message: "Suscripción no encontrada",
      };
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        paymentStatus,
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Estado de pago actualizado",
      data: updatedSubscription,
    };
  } catch (error) {
    console.error("Error en updateSubscriptionPayment:", error);
    return {
      success: false,
      message: "Error al actualizar el estado de pago",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener suscripciones por vencer en los próximos 7 días
 */
export async function getExpiringSubscriptions(gymId: string) {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        member: { gymId },
        status: "ACTIVE",
        endDate: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        member: true,
        plan: true,
      },
      orderBy: {
        endDate: "asc",
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error) {
    console.error("Error en getExpiringSubscriptions:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
