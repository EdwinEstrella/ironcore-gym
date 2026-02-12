import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  createMember,
  getMembers,
  getMemberStats,
} from "@/actions/member.actions";

/**
 * GET /api/members - Obtener todos los miembros del gimnasio
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
  const status = searchParams.get("status") as any;

  const result = await getMembers(session.user.gymId, status);

  return Response.json(result);
}

/**
 * POST /api/members - Crear un nuevo miembro
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

  const result = await createMember({
    gymId: session.user.gymId,
    ...body,
  });

  return Response.json(result, {
    status: result.success ? 201 : 400,
  });
}
