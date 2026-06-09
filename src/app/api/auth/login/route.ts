import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Ingresa la contraseña" }, { status: 400 });
    }

    let admin = await prisma.admin.findFirst();

    // Si es la primera vez, creamos el admin con la contraseña proporcionada y permitimos el acceso
    // NOTA: Para mayor seguridad en producción, este admin debe crearse por script.
    // Lo hacemos así para el primer setup.
    if (!admin) {
      if (password !== "admin123") {
         // Force the first password to be admin123
         return NextResponse.json({ error: "La contraseña inicial debe ser admin123" }, { status: 401 });
      }
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await prisma.admin.create({
        data: {
          password: hashedPassword,
        },
      });
    }

    // Verificar la contraseña
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Crear token y guardarlo en una cookie HttpOnly
    const token = await signToken({ adminId: admin.id });
    
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
