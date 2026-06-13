"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass-panel" style={{ position: "sticky", top: "1rem", zIndex: 100, margin: "1rem 2rem", borderRadius: "12px", padding: "1rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.jpg" alt="Roberto Venini Quiropraxia" width={200} height={200} style={{ objectFit: "contain", maxHeight: "60px", width: "auto", borderRadius: "8px" }} priority />
        </Link>
        
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 1rem" }}>
          <span style={{ 
            fontSize: "1.35rem", 
            fontWeight: 700, 
            color: "var(--color-primary-dark)", 
            letterSpacing: "-0.5px",
            textAlign: "center"
          }}>
            Consultorio quiropráctico de Roberto Venini
          </span>
        </div>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/" style={{ fontWeight: 500, color: "var(--color-text-main)" }}>Inicio</Link>
          <Link href="/agendar" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Agendar Turno</Link>
        </nav>
      </div>
    </header>
  );
}
