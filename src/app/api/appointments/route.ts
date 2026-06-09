import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dni, nombre, edad, direccion, telefono, mail, observaciones, date, time } = body;

    if (!dni || !nombre || !telefono || !mail || !date || !time) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Parse date and time safely
    const [hours, minutes] = time.split(":").map(Number);
    const [year, month, day] = date.split('-').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Check if slot is still available
    const existing = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        status: "CONFIRMED"
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Este turno ya no está disponible." }, { status: 400 });
    }

    // Upsert Patient (create if not exists by DNI, update if exists)
    const patient = await prisma.patient.upsert({
      where: { dni },
      update: {
        nombre,
        edad: edad ? parseInt(edad) : null,
        direccion,
        telefono,
        mail,
        observaciones
      },
      create: {
        dni,
        nombre,
        edad: edad ? parseInt(edad) : null,
        direccion,
        telefono,
        mail,
        observaciones
      }
    });

    // Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        date: appointmentDate,
        reason: observaciones
      }
    });

    // Send Confirmation Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS, 
        },
      });

      const formattedDate = appointmentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = time;

      await transporter.sendMail({
        from: '"Roberto Venini" <no-reply@quiropraxiavenini.com>',
        to: mail,
        subject: "Confirmación de Turno - Roberto Venini",
        text: `Hola ${nombre}, tu turno ha sido confirmado para el ${formattedDate} a las ${formattedTime}hs.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>¡Hola ${nombre}!</h2>
            <p>Tu turno en <strong>Quiropraxia Roberto Venini</strong> ha sido agendado con éxito.</p>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p><strong>Hora:</strong> ${formattedTime}hs</p>
            <p>Te recordaremos 24 horas antes de tu turno.</p>
            <br/>
            <p>Saludos,<br/>Consultorio Quiropráctico Roberto Venini</p>
          </div>
        `,
      });
      console.log("Email enviado a", mail);
    } catch (mailError) {
      console.error("No se pudo enviar el correo:", mailError);
      // We don't fail the booking if email fails
    }
    
    return NextResponse.json({ success: true, appointment });

  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
