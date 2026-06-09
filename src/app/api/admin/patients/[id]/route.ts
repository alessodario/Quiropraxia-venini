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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { dni, nombre, edad, direccion, telefono, mail, observaciones } = body;

    // Verificar si el paciente existe
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    // Si se modifica el DNI, verificar que no esté duplicado
    if (dni && dni !== patient.dni) {
      const existingDni = await prisma.patient.findUnique({ where: { dni } });
      if (existingDni) {
        return NextResponse.json({ error: "Ya existe otro paciente con ese DNI" }, { status: 400 });
      }
    }

    const updated = await prisma.patient.update({
      where: { id },
      data: {
        dni: dni ?? undefined,
        nombre: nombre ?? undefined,
        edad: edad !== undefined ? (edad ? parseInt(edad) : null) : undefined,
        direccion: direccion !== undefined ? direccion : undefined,
        telefono: telefono ?? undefined,
        mail: mail ?? undefined,
        observaciones: observaciones !== undefined ? observaciones : undefined
      }
    });

    return NextResponse.json({ success: true, patient: updated });
  } catch (error) {
    console.error("Update patient error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Verificar si el paciente existe
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    // Eliminar turnos del paciente para evitar fallos de integridad referencial
    await prisma.appointment.deleteMany({
      where: { patientId: id }
    });

    await prisma.patient.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete patient error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
