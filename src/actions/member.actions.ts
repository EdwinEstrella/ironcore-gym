"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Member, MemberStatus, Gender } from "@prisma/client";

// Tipos para las acciones
export interface CreateMemberInput {
  gymId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

export interface UpdateMemberInput {
  id: string;
  gymId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  status?: MemberStatus;
}

export interface MemberResult {
  success: boolean;
  message: string;
  data?: Member;
  error?: string;
}

/**
 * Obtener todos los miembros de un gimnasio
 */
export async function getMembers(gymId: string, status?: MemberStatus) {
  try {
    const where: { gymId: string; status?: MemberStatus } = { gymId };

    if (status) {
      where.status = status;
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: members,
    };
  } catch (error) {
    console.error("Error en getMembers:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener un miembro por ID
 */
export async function getMemberById(id: string, gymId: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        id,
        gymId,
      },
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!member) {
      return {
        success: false,
        message: "Miembro no encontrado",
      };
    }

    return {
      success: true,
      data: member,
    };
  } catch (error) {
    console.error("Error en getMemberById:", error);
    return {
      success: false,
      message: "Error al obtener el miembro",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crear un nuevo miembro
 */
export async function createMember(data: CreateMemberInput): Promise<MemberResult> {
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

    // Si se proporciona email, verificar que no esté duplicado en el mismo gimnasio
    if (data.email) {
      const existingMember = await prisma.member.findFirst({
        where: {
          gymId: data.gymId,
          email: data.email,
        },
      });

      if (existingMember) {
        return {
          success: false,
          message: "Ya existe un miembro con ese email en este gimnasio",
        };
      }
    }

    const member = await prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        notes: data.notes,
        gymId: data.gymId,
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Miembro creado correctamente",
      data: member,
    };
  } catch (error) {
    console.error("Error en createMember:", error);
    return {
      success: false,
      message: "Error al crear el miembro",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Actualizar un miembro
 */
export async function updateMember(data: UpdateMemberInput): Promise<MemberResult> {
  try {
    // Verificar que el miembro existe y pertenece al gimnasio
    const existingMember = await prisma.member.findFirst({
      where: {
        id: data.id,
        gymId: data.gymId,
      },
    });

    if (!existingMember) {
      return {
        success: false,
        message: "Miembro no encontrado",
      };
    }

    // Si se actualiza el email, verificar que no esté duplicado
    if (data.email && data.email !== existingMember.email) {
      const duplicateMember = await prisma.member.findFirst({
        where: {
          gymId: data.gymId,
          email: data.email,
          id: { not: data.id },
        },
      });

      if (duplicateMember) {
        return {
          success: false,
          message: "Ya existe un miembro con ese email",
        };
      }
    }

    const member = await prisma.member.update({
      where: { id: data.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        notes: data.notes,
        status: data.status,
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/members/${data.id}`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Miembro actualizado correctamente",
      data: member,
    };
  } catch (error) {
    console.error("Error en updateMember:", error);
    return {
      success: false,
      message: "Error al actualizar el miembro",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Eliminar un miembro (soft delete - cambiar estado a CANCELLED)
 */
export async function deleteMember(id: string, gymId: string): Promise<MemberResult> {
  try {
    // Verificar que el miembro existe y pertenece al gimnasio
    const existingMember = await prisma.member.findFirst({
      where: {
        id,
        gymId,
      },
    });

    if (!existingMember) {
      return {
        success: false,
        message: "Miembro no encontrado",
      };
    }

    // Soft delete - cambiar estado a CANCELLED
    const member = await prisma.member.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath(`/members`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Miembro eliminado correctamente",
      data: member,
    };
  } catch (error) {
    console.error("Error en deleteMember:", error);
    return {
      success: false,
      message: "Error al eliminar el miembro",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener estadísticas de miembros del gimnasio
 */
export async function getMemberStats(gymId: string) {
  try {
    const [
      totalMembers,
      activeMembers,
      inactiveMembers,
      suspendedMembers,
    ] = await Promise.all([
      prisma.member.count({ where: { gymId } }),
      prisma.member.count({ where: { gymId, status: "ACTIVE" } }),
      prisma.member.count({ where: { gymId, status: "INACTIVE" } }),
      prisma.member.count({ where: { gymId, status: "SUSPENDED" } }),
    ]);

    // Miembros nuevos este mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newMembersThisMonth = await prisma.member.count({
      where: {
        gymId,
        createdAt: { gte: startOfMonth },
      },
    });

    return {
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        suspendedMembers,
        newMembersThisMonth,
      },
    };
  } catch (error) {
    console.error("Error en getMemberStats:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
