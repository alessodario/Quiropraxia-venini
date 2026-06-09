import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Verificar sesión
    const token = request.headers.get("cookie")?.split("admin_session=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !payload.adminId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: payload.adminId as string },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
