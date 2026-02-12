import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createPlan, getPlans } from "@/actions/plan.actions";

/**
 * GET /api/plans - Obtener todos los planes del gimnasio
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive") === "true";

  const result = await getPlans(session.user.gymId, includeInactive);

  return Response.json(result);
}

/**
 * POST /api/plans - Crear un nuevo plan
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const result = await createPlan({
    gymId: session.user.gymId,
    ...body,
  });

  return Response.json(result, {
    status: result.success ? 201 : 400,
  });
}
