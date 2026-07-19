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
  if (!(await checkAuth(request))) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { action, date, time, patientData } = await request.json();
    const { id: appointmentId } = await params; // Await params in Next.js 15+

    if (action === "CANCEL") {
      // Marcar como cancelado
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" }
      });
      return NextResponse.json({ success: true, updated });
    } 
    
    if (action === "UPDATE") {
      const app = await prisma.appointment.findUnique({ where: { id: appointmentId } });
      if (!app) return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });

      // Update patient data
      if (patientData) {
         let finalObservaciones = app.patient?.observaciones;
         if (patientData.nueva_observacion && patientData.nueva_observacion.trim() !== "") {
           const now = new Date();
           const dateOptions: Intl.DateTimeFormatOptions = { timeZone: "America/Argentina/Buenos_Aires", day: '2-digit', month: '2-digit', year: 'numeric' };
           const timeOptions: Intl.DateTimeFormatOptions = { timeZone: "America/Argentina/Buenos_Aires", hour: '2-digit', minute: '2-digit' };
           const dateStr = now.toLocaleDateString('es-AR', dateOptions);
           const timeStr = now.toLocaleTimeString('es-AR', timeOptions);
           const nuevaNota = `[${dateStr} - ${timeStr}hs] ${patientData.nueva_observacion}`;
           finalObservaciones = finalObservaciones ? `${finalObservaciones}\n${nuevaNota}` : nuevaNota;
         }

         await prisma.patient.update({
           where: { id: app.patientId },
           data: {
             dni: patientData.dni,
             nombre: patientData.nombre,
             edad: patientData.edad ? Number(patientData.edad) : null,
             direccion: patientData.direccion,
             telefono: patientData.telefono,
             mail: patientData.mail,
             ...(patientData.nueva_observacion && patientData.nueva_observacion.trim() !== "" ? { observaciones: finalObservaciones } : {})
           }
         });
      }

      // Update date and time if present
      if (date && time) {
          const [hours, minutes] = time.split(":").map(Number);
          const [year, month, day] = date.split('-').map(Number);
          const newDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

          // Verify slot is free (excluding the current appointment itself)
          const existing = await prisma.appointment.findFirst({
            where: {
              date: newDate,
              status: "CONFIRMED",
              id: { not: appointmentId }
            }
          });

          if (existing) {
             return NextResponse.json({ error: "Ese horario ya está ocupado" }, { status: 400 });
          }

          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { date: newDate }
          });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });

  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
