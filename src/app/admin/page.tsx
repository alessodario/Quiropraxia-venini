import { PrismaClient } from "@prisma/client";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const appointments = await prisma.appointment.findMany({
    where: { status: "CONFIRMED" },
    include: { patient: true },
    orderBy: { date: 'asc' }
  });

  const patients = await prisma.patient.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      appointments: {
        orderBy: { date: 'desc' }
      }
    }
  });

  return <AdminDashboardClient initialAppointments={appointments} initialPatients={patients} />;
}
