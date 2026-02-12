import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getPlanById, updatePlan, deletePlan } from "@/actions/plan.actions";

/**
 * GET /api/plans/[id] - Obtener un plan por ID
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
  const result = await getPlanById(id, session.user.gymId);

  return Response.json(result);
}

/**
 * PUT /api/plans/[id] - Actualizar un plan
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

  const result = await updatePlan({
    id: id,
    gymId: session.user.gymId,
    ...body,
  });

  return Response.json(result);
}

/**
 * DELETE /api/plans/[id] - Eliminar un plan
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
  const result = await deletePlan(id, session.user.gymId);

  return Response.json(result);
}
