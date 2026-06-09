import BookingForm from "@/components/BookingForm";

export default function AgendarPage() {
  return (
    <div className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem" }}>Reserva tu Sesión</h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Selecciona el horario que mejor se adapte a ti y completa tus datos.
        </p>
      </div>
      
      <BookingForm />
    </div>
  );
}
