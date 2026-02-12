import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  getMemberById,
  updateMember,
  deleteMember,
} from "@/actions/member.actions";

/**
 * GET /api/members/[id] - Obtener un miembro por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await getMemberById(id, session.user.gymId);

  return Response.json(result);
}

/**
 * PUT /api/members/[id] - Actualizar un miembro
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const result = await updateMember({
    id: id,
    gymId: session.user.gymId,
    ...body,
  });

  return Response.json(result);
}

/**
 * DELETE /api/members/[id] - Eliminar un miembro
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await deleteMember(id, session.user.gymId);

  return Response.json(result);
}
