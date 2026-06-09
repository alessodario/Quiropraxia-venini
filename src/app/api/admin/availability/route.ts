import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const dates = await prisma.availableDate.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json({ dates });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching availability" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, date, startTime, endTime } = body;

    if (action === "TOGGLE") {
      const dateObj = new Date(date + "T00:00:00Z");
      const existing = await prisma.availableDate.findUnique({
        where: { date: dateObj }
      });

      if (existing) {
        await prisma.availableDate.delete({
          where: { id: existing.id }
        });
        return NextResponse.json({ success: true, message: "Día deshabilitado", enabled: false });
      } else {
        await prisma.availableDate.create({
          data: {
            date: dateObj,
            startTime: startTime || "11:00",
            endTime: endTime || "18:00"
          }
        });
        return NextResponse.json({ success: true, message: "Día habilitado", enabled: true });
      }
    } else if (action === "UPDATE") {
      const dateObj = new Date(date + "T00:00:00Z");
      await prisma.availableDate.update({
        where: { date: dateObj },
        data: { startTime, endTime }
      });
      return NextResponse.json({ success: true, message: "Horario actualizado" });
    } else if (action === "FILL_MONTH") {
      // Helper to fill Mondays, Tuesdays, Fridays for a given month
      const { year, month } = body;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let added = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dayOfWeek = d.getDay();
        // 1=Mon, 2=Tue, 5=Fri
        if (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 5) {
          const dateStr = `${year}-${(month+1).toString().padStart(2,"0")}-${day.toString().padStart(2,"0")}`;
          const dateObj = new Date(dateStr + "T00:00:00Z");
          
          const existing = await prisma.availableDate.findUnique({ where: { date: dateObj } });
          if (!existing) {
            let st = "11:00";
            if (dayOfWeek === 2) st = "14:00"; // Tuesdays default
            
            await prisma.availableDate.create({
              data: {
                date: dateObj,
                startTime: st,
                endTime: "18:00"
              }
            });
            added++;
          }
        }
      }
      return NextResponse.json({ success: true, message: `Se habilitaron ${added} días en el mes.` });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}
