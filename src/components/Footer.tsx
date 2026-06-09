import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ marginTop: "4rem", padding: "3rem 2rem", backgroundColor: "var(--color-primary-dark)", color: "white", textAlign: "center" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <h3 style={{ color: "white", marginBottom: "0.5rem" }}>Consultorio Quiropráctico - Roberto Venini</h3>
        <p>San Carlos de Bariloche, Argentina</p>
        <p>Lunes y Viernes: 11:00 - 19:00 | Martes: 14:00 - 19:00</p>
        
        <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.2)", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
          <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", textDecoration: "none" }}>
            Acceso Profesional
          </Link>
        </div>
      </div>
    </footer>
  );
}
