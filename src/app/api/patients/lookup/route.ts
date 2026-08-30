import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get("dni");

  if (!dni) {
    return NextResponse.json({ error: "Missing DNI" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { dni }
    });

    if (patient) {
      return NextResponse.json({ patient });
    }

    return NextResponse.json({ patient: null });
  } catch (error) {
    console.error("Error looking up patient:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
