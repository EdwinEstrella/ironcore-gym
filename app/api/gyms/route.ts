import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getGymById, getGymStats, updateGym } from "@/actions/gym.actions";

/**
 * GET /api/gyms - Obtener información del gimnasio del usuario
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
  const stats = searchParams.get("stats") === "true";

  if (stats) {
    const result = await getGymStats(session.user.gymId);
    return Response.json(result);
  }

  const result = await getGymById(session.user.gymId);

  return Response.json(result);
}

/**
 * PUT /api/gyms - Actualizar información del gimnasio
 */
export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const result = await updateGym({
    id: session.user.gymId,
    ...body,
  });

  return Response.json(result);
}
