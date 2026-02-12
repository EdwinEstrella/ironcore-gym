import { NextRequest, NextResponse } from "next/server";
import { registerGym } from "@/actions/auth.actions";

/**
 * POST /api/auth/register - Registrar un nuevo gimnasio y usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await registerGym(body);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error("Error en POST /api/auth/register:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al registrar el gimnasio",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
