import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  updateSubscriptionPayment,
  getExpiringSubscriptions,
} from "@/actions/plan.actions";

/**
 * GET /api/subscriptions - Obtener todas las suscripciones del gimnasio
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
  const expiring = searchParams.get("expiring") === "true";

  if (expiring) {
    const result = await getExpiringSubscriptions(session.user.gymId);
    return Response.json(result);
  }

  const result = await getSubscriptions(session.user.gymId, status);

  return Response.json(result);
}

/**
 * POST /api/subscriptions - Crear una nueva suscripción
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

  const result = await createSubscription({
    gymId: session.user.gymId,
    ...body,
  });

  return Response.json(result, {
    status: result.success ? 201 : 400,
  });
}

/**
 * PATCH /api/subscriptions - Actualizar una suscripción
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.gymId) {
    return Response.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { id, action, paymentStatus } = body;

  if (action === "cancel") {
    const result = await cancelSubscription(id, session.user.gymId);
    return Response.json(result);
  }

  if (action === "updatePayment" && paymentStatus) {
    const result = await updateSubscriptionPayment(
      id,
      session.user.gymId,
      paymentStatus
    );
    return Response.json(result);
  }

  return Response.json(
    { error: "Acción no válida" },
    { status: 400 }
  );
}
