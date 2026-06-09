import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

async function checkAuth(request: Request) {
  const token = request.headers.get("cookie")?.split("admin_session=")[1]?.split(";")[0];
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function GET(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const patients = await prisma.patient.findMany({
      orderBy: { nombre: "asc" }
    });
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Fetch patients error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dni, nombre, edad, direccion, telefono, mail, observaciones } = body;

    if (!dni || !nombre || !telefono || !mail) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Verificar si ya existe un paciente con ese DNI
    const existing = await prisma.patient.findUnique({
      where: { dni }
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un paciente con este DNI" }, { status: 400 });
    }

    const patient = await prisma.patient.create({
      data: {
        dni,
        nombre,
        edad: edad ? parseInt(edad) : null,
        direccion,
        telefono,
        mail,
        observaciones
      }
    });

    return NextResponse.json({ success: true, patient });
  } catch (error) {
    console.error("Create patient error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
