"use client";

import { useState, useEffect } from "react";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // States for interactive monthly calendar
  const todayObj = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayObj.getMonth());
  const [currentYear, setCurrentYear] = useState(todayObj.getFullYear());

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPrevDisabled = currentYear < todayObj.getFullYear() || 
    (currentYear === todayObj.getFullYear() && currentMonth <= todayObj.getMonth());

  const handleDayClick = (dayNum: number) => {
    const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;
    setDate(formattedDate);
  };
  
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    edad: "",
    direccion: "",
    telefono: "",
    mail: "",
    observaciones: ""
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get minimum date (today) formatted for input type="date"
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetch("/api/admin/availability")
      .then(res => res.json())
      .then(data => {
        if (data.dates) {
          setAvailableDates(data.dates.map((d: any) => d.date.split("T")[0]));
        }
      });
  }, []);

  useEffect(() => {
    if (date) {
      setLoadingSlots(true);
      setTime(""); // Reset time when date changes
      fetch(`/api/slots?date=${date}`)
        .then(res => res.json())
        .then(data => {
          if (data.slots) {
            setAvailableSlots(data.slots);
          } else {
            setAvailableSlots([]);
          }
          setLoadingSlots(false);
        })
        .catch(err => {
          console.error(err);
          setAvailableSlots([]);
          setLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, date, time })
      });

      const result = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(result.error || "Ocurrió un error al agendar el turno.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
        <h2>¡Turno Agendado con Éxito!</h2>
        <p>Te hemos enviado un correo de confirmación a {formData.mail}.</p>
        <p>Te recordaremos 24hs antes de tu turno.</p>
        <button className="btn btn-primary" style={{ marginTop: "2rem" }} onClick={() => window.location.href="/"}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Agendar Turno</h2>
      
      <div style={{ display: "flex", marginBottom: "2rem", borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>
        <div style={{ flex: 1, textAlign: "center", fontWeight: step === 1 ? "bold" : "normal", color: step === 1 ? "var(--color-primary)" : "#999" }}>1. Fecha y Hora</div>
        <div style={{ flex: 1, textAlign: "center", fontWeight: step === 2 ? "bold" : "normal", color: step === 2 ? "var(--color-primary)" : "#999" }}>2. Tus Datos</div>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {errorMsg}
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: "1rem", textAlign: "center", display: "block" }}>
              Selecciona el día de tu turno
            </label>
            
            <div className="calendar-container">
              <div className="calendar-header">
                <button 
                  type="button" 
                  className="calendar-nav-btn" 
                  onClick={prevMonth} 
                  disabled={isPrevDisabled}
                >
                  &larr;
                </button>
                <span className="calendar-month-title">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button 
                  type="button" 
                  className="calendar-nav-btn" 
                  onClick={nextMonth}
                >
                  &rarr;
                </button>
              </div>

              <div className="calendar-grid-weekdays">
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
                <div>Dom</div>
              </div>

              <div className="calendar-grid-days">
                {Array.from({ length: (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day-empty" />
                ))}

                {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(currentYear, currentMonth, dayNum);
                  const dayOfWeek = dateObj.getDay(); // 0: Sun, 1: Mon, ...
                  
                  // Compare just dates (year, month, day) to check if past
                  const todayMidnight = new Date();
                  todayMidnight.setHours(0, 0, 0, 0);
                  const cellDate = new Date(currentYear, currentMonth, dayNum);
                  const isPast = cellDate < todayMidnight;
                  
                  const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;
                  const isConfigured = availableDates.includes(dateStr);
                  const isSelectable = isConfigured && !isPast;
                  
                  const isSelected = date === dateStr;

                  let cellClass = "calendar-day-cell";
                  if (isSelected) {
                    cellClass += " calendar-day-selected";
                  } else if (isSelectable) {
                    cellClass += " calendar-day-available";
                  } else {
                    cellClass += " calendar-day-disabled";
                  }

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      className={cellClass}
                      disabled={!isSelectable}
                      onClick={() => handleDayClick(dayNum)}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <small style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)" }}>
                <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "rgba(77, 182, 172, 0.2)", border: "1px solid var(--color-accent)" }} />
                Los días habilitados para turnos se muestran resaltados.
              </small>
            </div>
          </div>

          {date && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Horarios Disponibles</label>
              {loadingSlots ? (
                <p>Cargando horarios...</p>
              ) : availableSlots.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {availableSlots.map(slot => (
                    <button 
                      key={slot}
                      type="button"
                      className={`btn ${time === slot ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setTime(slot)}
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#b91c1c" }}>No hay turnos disponibles para este día o el consultorio está cerrado.</p>
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setStep(2)} 
              disabled={!date || !time}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">DNI *</label>
              <input required type="text" name="dni" className="form-input" value={formData.dni} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input required type="text" name="nombre" className="form-input" value={formData.nombre} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input required type="tel" name="telefono" className="form-input" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Mail *</label>
              <input required type="email" name="mail" className="form-input" value={formData.mail} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Edad</label>
              <input type="number" name="edad" className="form-input" value={formData.edad} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input type="text" name="direccion" className="form-input" value={formData.direccion} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Motivo de la consulta / Observaciones</label>
            <textarea name="observaciones" className="form-input" value={formData.observaciones} onChange={handleChange}></textarea>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Volver</button>
            <button type="submit" className="btn btn-primary" disabled={loadingSubmit}>
              {loadingSubmit ? "Procesando..." : "Confirmar Turno"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
