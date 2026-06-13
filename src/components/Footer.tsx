import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ marginTop: "4rem", padding: "3rem 2rem", backgroundColor: "var(--color-primary-dark)", color: "white", textAlign: "center" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <h3 style={{ color: "white", marginBottom: "0.5rem" }}>Consultorio Quiropráctico - Roberto Venini</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "1.05rem" }}>Av. Belgrano 670</p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.9)" }}>
            Cel: <strong>2944 306991</strong> &nbsp;|&nbsp; Fijo: <strong>2944 424690</strong>
          </p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.9)" }}>
            Mail: <a href="mailto:quironon@gmail.com" style={{ color: "white", fontWeight: 600, textDecoration: "none" }}>quironon@gmail.com</a>
          </p>
        </div>

        <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>San Carlos de Bariloche, Argentina</p>
        
        <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem", borderRadius: "8px", marginTop: "0.5rem" }}>
          <p style={{ margin: 0, fontWeight: 500 }}>Lunes y Viernes: 11:00 - 19:00 &nbsp;|&nbsp; Martes: 14:00 - 19:00</p>
        </div>
        
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
