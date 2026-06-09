import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "La fecha es requerida" }, { status: 400 });
  }

  // Format the date to match the DB format: YYYY-MM-DDT00:00:00Z
  const dateObj = new Date(dateStr + "T00:00:00Z");

  const availableDate = await prisma.availableDate.findUnique({
    where: { date: dateObj }
  });

  if (!availableDate) {
    return NextResponse.json({ slots: [] }); // Not a configured working day
  }

  // Generate slots from startTime to endTime (hourly)
  let possibleSlots: string[] = [];
  const startHour = parseInt(availableDate.startTime.split(":")[0]);
  const endHour = parseInt(availableDate.endTime.split(":")[0]);
  
  for (let h = startHour; h <= endHour; h++) {
    possibleSlots.push(`${h.toString().padStart(2, "0")}:00`);
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Get start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch existing appointments
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: "CONFIRMED"
    },
    select: {
      date: true
    }
  });

  // Extract hours of booked appointments
  const bookedHours = existingAppointments.map(app => {
    // Convert to local time string like "14:00"
    const h = app.date.getHours().toString().padStart(2, "0");
    const m = app.date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });

  // Filter out booked slots
  const availableSlots = possibleSlots.filter(slot => !bookedHours.includes(slot));

  return NextResponse.json({ slots: availableSlots });
}
