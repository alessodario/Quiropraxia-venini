"use client";

import { useState } from "react";

type Appointment = any; // simplified for this example

export default function AdminDashboardClient({ 
  initialAppointments, 
  initialPatients 
}: { 
  initialAppointments: Appointment[]; 
  initialPatients: any[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients, setPatients] = useState(initialPatients || []);
  const [activeTab, setActiveTab] = useState<"appointments" | "patients">("appointments");
  const [patientSearch, setPatientSearch] = useState("");
  const [patientError, setPatientError] = useState("");

  // Patient inline editing states
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editingPatientData, setEditingPatientData] = useState({
    dni: "", nombre: "", edad: "", direccion: "", telefono: "", mail: "", observaciones: "", nueva_observacion: ""
  });

  // Patient manual adding states
  const [showAddRow, setShowAddRow] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    dni: "", nombre: "", edad: "", direccion: "", telefono: "", mail: "", observaciones: ""
  });
  const [loadingAddPatient, setLoadingAddPatient] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [patientData, setPatientData] = useState({
    dni: "", nombre: "", edad: "", direccion: "", telefono: "", mail: "", observaciones: ""
  });

  // Schedule Config States
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configDates, setConfigDates] = useState<any[]>([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [configYear, setConfigYear] = useState(new Date().getFullYear());
  const [configMonth, setConfigMonth] = useState(new Date().getMonth());
  const [selectedConfigDate, setSelectedConfigDate] = useState<string | null>(null);
  const [configStartTime, setConfigStartTime] = useState("11:00");
  const [configEndTime, setConfigEndTime] = useState("18:00");

  const loadConfigDates = async () => {
    setConfigLoading(true);
    try {
      const res = await fetch("/api/admin/availability");
      const data = await res.json();
      setConfigDates(data.dates || []);
    } catch (err) {}
    setConfigLoading(false);
  };

  const openConfigModal = () => {
    loadConfigDates();
    setShowConfigModal(true);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que deseas cancelar este turno? El horario quedará libre.")) return;
    
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" })
      });
      if (res.ok) {
        setAppointments(appointments.filter(a => a.id !== id));
      } else {
        alert("Error al cancelar el turno");
      }
    } catch (e) {
      alert("Error de red");
    }
  };

  const openReschedule = (app: Appointment) => {
    setEditingApp(app);
    
    const d = new Date(app.date);
    const localDate = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const localTime = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // HH:MM
    
    setNewDate(localDate);
    setNewTime(localTime);
    setAvailableSlots([localTime]); // Add current time to available initially
    
    setPatientData({
      dni: app.patient?.dni || "",
      nombre: app.patient?.nombre || "",
      edad: app.patient?.edad?.toString() || "",
      direccion: app.patient?.direccion || "",
      telefono: app.patient?.telefono || "",
      mail: app.patient?.mail || "",
      observaciones: app.patient?.observaciones || ""
    });

    setShowRescheduleModal(true);
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value;
    setNewDate(d);
    setNewTime("");
    if (d) {
      setLoadingSlots(true);
      try {
         const res = await fetch(`/api/slots?date=${d}`);
         const data = await res.json();
         setAvailableSlots(data.slots || []);
      } catch (err) {}
      setLoadingSlots(false);
    } else {
      setAvailableSlots([]);
    }
  };

  const handlePatientDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const submitReschedule = async () => {
    if (!editingApp || !newDate || !newTime || !patientData.nombre || !patientData.dni) {
      alert("Por favor completa los campos obligatorios");
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/appointments/${editingApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE", date: newDate, time: newTime, patientData })
      });
      if (res.ok) {
        alert("Datos modificados correctamente");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Error al modificar");
      }
    } catch (e) {
      alert("Error de red");
    }
  };

  const changePassword = async () => {
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        alert("Contraseña actualizada con éxito");
        setShowPasswordModal(false);
        setNewPassword("");
      } else {
        const data = await res.json();
        alert(data.error || "Error al cambiar contraseña");
      }
    } catch (e) {
      alert("Error de red");
    }
  };

  // Patient database functions
  const handleEditPatientClick = (patient: any) => {
    setEditingPatientId(patient.id);
    setEditingPatientData({
      dni: patient.dni,
      nombre: patient.nombre,
      edad: patient.edad?.toString() || "",
      direccion: patient.direccion || "",
      telefono: patient.telefono || "",
      mail: patient.mail || "",
      observaciones: patient.observaciones || "",
      nueva_observacion: ""
    });
    setPatientError("");
  };

  const handleEditPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingPatientData({ ...editingPatientData, [e.target.name]: e.target.value });
  };

  const handleSavePatient = async (id: string) => {
    if (!editingPatientData.dni || !editingPatientData.nombre || !editingPatientData.telefono || !editingPatientData.mail) {
      setPatientError("DNI, Nombre, Teléfono y Mail son campos obligatorios");
      return;
    }
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPatientData)
      });
      const data = await res.json();
      if (res.ok) {
        setPatients(patients.map(p => p.id === id ? data.patient : p));
        setEditingPatientId(null);
        setPatientError("");
      } else {
        setPatientError(data.error || "Error al actualizar paciente");
      }
    } catch (e) {
      setPatientError("Error de conexión");
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este paciente? Esto cancelará también todos sus turnos.")) return;
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setPatients(patients.filter(p => p.id !== id));
        // Remove cancelled appointments locally
        setAppointments(appointments.filter(a => a.patientId !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatientData({ ...newPatientData, [e.target.name]: e.target.value });
  };

  const handleAddPatientSubmit = async () => {
    if (!newPatientData.dni || !newPatientData.nombre || !newPatientData.telefono || !newPatientData.mail) {
      setPatientError("DNI, Nombre, Teléfono y Mail son obligatorios");
      return;
    }
    setLoadingAddPatient(true);
    setPatientError("");
    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatientData)
      });
      const data = await res.json();
      if (res.ok) {
        setPatients([...patients, data.patient].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setNewPatientData({
          dni: "", nombre: "", edad: "", direccion: "", telefono: "", mail: "", observaciones: ""
        });
        setShowAddRow(false);
      } else {
        setPatientError(data.error || "Error al agregar");
      }
    } catch (e) {
      setPatientError("Error de conexión");
    } finally {
      setLoadingAddPatient(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(patientSearch.toLowerCase()) || 
    p.dni.includes(patientSearch)
  );

  const handleExportExcel = async () => {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pacientes');

      // Set column widths
      worksheet.getColumn(1).width = 18; // A
      worksheet.getColumn(2).width = 25; // B
      worksheet.getColumn(3).width = 10; // C
      worksheet.getColumn(4).width = 25; // D
      worksheet.getColumn(5).width = 15; // E
      worksheet.getColumn(6).width = 25; // F
      worksheet.getColumn(7).width = 40; // G
      worksheet.getColumn(8).width = 40; // H

      // Fetch the logo image
      let imageId;
      try {
        const response = await fetch('/logo.jpg');
        const imageBuffer = await response.arrayBuffer();
        imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: 'jpeg',
        });
      } catch (err) {
        console.error("No se pudo cargar el logo:", err);
      }

      // Setup Header rows layout
      worksheet.getRow(1).height = 20;
      worksheet.getRow(2).height = 30;
      worksheet.getRow(3).height = 30;
      worksheet.getRow(4).height = 20;
      worksheet.getRow(5).height = 25;

      // Merge cells for Title
      worksheet.mergeCells('B2:H3');
      const titleCell = worksheet.getCell('B2');
      titleCell.value = 'BASE DE DATOS DE PACIENTES';
      titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF004D40' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      // Add logo over A1:A4 (Col 0, Row 0 to Col 1, Row 4)
      if (imageId !== undefined) {
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0.2 } as any,
          br: { col: 1, row: 3.8 } as any,
          editAs: 'oneCell'
        });
      }

      // Add data headers (Row 5)
      const headerRow = worksheet.getRow(5);
      headerRow.values = ['DNI', 'NOMBRE Y APELLIDO', 'EDAD', 'DIRECCIÓN', 'TELÉFONO', 'MAIL', 'OBSERVACIONES', 'HISTORIAL DE TURNOS'];
      
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' } // Amber color
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      // Add Patient Data (from Row 6)
      filteredPatients.forEach((p, index) => {
        const row = worksheet.getRow(6 + index);
        const historialTurnos = p.appointments && p.appointments.length > 0 
          ? p.appointments.map((a: any) => `${new Date(a.date).toLocaleDateString('es-AR')} - ${a.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}`).join('\n')
          : "Sin turnos";
        
        row.values = [
          p.dni,
          p.nombre,
          p.edad,
          p.direccion,
          p.telefono,
          p.mail,
          p.observaciones,
          historialTurnos
        ];
        row.eachCell((cell) => {
           cell.alignment = { vertical: 'middle', wrapText: true };
        });
      });

      // Generate Buffer and Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Base_Pacientes.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Hubo un error al exportar la base de datos.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: "4rem 2rem", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--color-primary-dark)" }}>Panel de Administrador</h1>
        <button className="btn btn-outline" onClick={() => setShowPasswordModal(true)}>
          Cambiar Contraseña
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "0.5rem" }}>
        <button 
          onClick={() => setActiveTab("appointments")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "appointments" ? "3px solid var(--color-primary)" : "3px solid transparent",
            padding: "0.5rem 1rem",
            fontSize: "1.1rem",
            fontWeight: activeTab === "appointments" ? "bold" : "normal",
            color: activeTab === "appointments" ? "var(--color-primary-dark)" : "var(--color-text-muted)",
            cursor: "pointer",
            transition: "var(--transition)"
          }}
        >
          📅 Turnos Agendados
        </button>
        <button 
          onClick={() => setActiveTab("patients")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "patients" ? "3px solid var(--color-primary)" : "3px solid transparent",
            padding: "0.5rem 1rem",
            fontSize: "1.1rem",
            fontWeight: activeTab === "patients" ? "bold" : "normal",
            color: activeTab === "patients" ? "var(--color-primary-dark)" : "var(--color-text-muted)",
            cursor: "pointer",
            transition: "var(--transition)"
          }}
        >
          📊 Base de Datos (Pacientes)
        </button>
      </div>

      {activeTab === "appointments" ? (
        <div className="glass-panel" style={{ padding: "2rem", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0 }}>Turnos Agendados</h2>
            <button className="btn btn-outline" onClick={openConfigModal}>
              📅 Configurar Días de Atención
            </button>
          </div>
          
          {appointments.length === 0 ? (
            <p>No hay turnos agendados por el momento.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                  <th style={{ padding: "1rem", color: "var(--color-text-muted)" }}>Fecha y Hora</th>
                  <th style={{ padding: "1rem", color: "var(--color-text-muted)" }}>Paciente</th>
                  <th style={{ padding: "1rem", color: "var(--color-text-muted)" }}>Teléfono</th>
                  <th style={{ padding: "1rem", color: "var(--color-text-muted)" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <td style={{ padding: "1rem", fontWeight: "bold" }}>
                      {new Date(app.date).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      {" - "}
                      {new Date(app.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs
                    </td>
                    <td style={{ padding: "1rem" }}>{app.patient?.nombre} ({app.patient?.dni})</td>
                    <td style={{ padding: "1rem" }}>{app.patient?.telefono}</td>
                    <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} onClick={() => openReschedule(app)}>
                        Modificar
                      </button>
                      <button className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", color: "#b91c1c", borderColor: "#b91c1c" }} onClick={() => handleCancel(app.id)}>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Planilla de Pacientes</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input 
              type="text" 
              placeholder="🔍 Buscar por Nombre o DNI..." 
              className="form-input" 
              style={{ maxWidth: "350px", padding: "0.5rem 1rem" }}
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={handlePrint} style={{ padding: "0.5rem 1rem" }}>
                🖨️ Imprimir
              </button>
              <button className="btn btn-outline" onClick={handleExportExcel} style={{ padding: "0.5rem 1rem" }}>
                📊 Descargar Excel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: "0.5rem 1.5rem" }}
                onClick={() => {
                  setShowAddRow(!showAddRow);
                  setPatientError("");
                }}
              >
                {showAddRow ? "✖ Cancelar" : "➕ Agregar Paciente"}
              </button>
            </div>
          </div>

          {patientError && (
            <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
              ⚠️ {patientError}
            </div>
          )}

          <div className="printable-area" style={{ overflowX: "auto" }}>
            <table className="excel-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "110px" }}>DNI</th>
                  <th style={{ minWidth: "180px" }}>Nombre y Apellido</th>
                  <th style={{ width: "65px" }}>Edad</th>
                  <th style={{ minWidth: "180px" }}>Dirección</th>
                  <th style={{ minWidth: "130px" }}>Teléfono</th>
                  <th style={{ minWidth: "200px" }}>Mail</th>
                  <th style={{ minWidth: "250px" }}>Observaciones</th>
                  <th style={{ minWidth: "200px" }}>Historial de Turnos</th>
                  <th className="no-print" style={{ width: "160px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {showAddRow && (
                  <tr style={{ backgroundColor: "#e2f0d9" }}>
                    <td>
                      <input name="dni" type="text" placeholder="DNI" className="excel-input" value={newPatientData.dni} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="nombre" type="text" placeholder="Nombre y Apellido" className="excel-input" value={newPatientData.nombre} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="edad" type="number" placeholder="Edad" className="excel-input" value={newPatientData.edad} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="direccion" type="text" placeholder="Dirección" className="excel-input" value={newPatientData.direccion} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="telefono" type="tel" placeholder="Teléfono" className="excel-input" value={newPatientData.telefono} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="mail" type="email" placeholder="Mail" className="excel-input" value={newPatientData.mail} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>
                      <input name="observaciones" type="text" placeholder="Observaciones" className="excel-input" value={newPatientData.observaciones} onChange={handleNewPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #a9d08e", background: "white" }} />
                    </td>
                    <td>-</td>
                    <td className="no-print">
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button className="btn btn-primary" onClick={handleAddPatientSubmit} disabled={loadingAddPatient} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "70px" }}>
                          {loadingAddPatient ? "..." : "Guardar"}
                        </button>
                        <button className="btn btn-outline" onClick={() => { setShowAddRow(false); setPatientError(""); }} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "70px" }}>
                          Cerrar
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
                      No se encontraron pacientes registrados.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => {
                    const isEditing = editingPatientId === patient.id;

                    if (isEditing) {
                      return (
                        <tr key={patient.id} style={{ backgroundColor: "#fff2cc" }}>
                          <td>
                            <input name="dni" type="text" className="excel-input" value={editingPatientData.dni} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <input name="nombre" type="text" className="excel-input" value={editingPatientData.nombre} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <input name="edad" type="number" className="excel-input" value={editingPatientData.edad} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <input name="direccion" type="text" className="excel-input" value={editingPatientData.direccion} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <input name="telefono" type="tel" className="excel-input" value={editingPatientData.telefono} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <input name="mail" type="email" className="excel-input" value={editingPatientData.mail} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td>
                            <div style={{ whiteSpace: "pre-wrap", maxHeight: "80px", overflowY: "auto", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                              {editingPatientData.observaciones || "Sin observaciones previas"}
                            </div>
                            <input name="nueva_observacion" type="text" placeholder="Nueva observación..." className="excel-input" value={editingPatientData.nueva_observacion} onChange={handleEditPatientChange} onFocus={(e) => e.target.select()} style={{ border: "1px solid #ffd966", background: "white" }} />
                          </td>
                          <td style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", whiteSpace: "pre-wrap" }}>
                             {patient.appointments && patient.appointments.length > 0 
                               ? patient.appointments.map((a: any) => `${new Date(a.date).toLocaleDateString('es-AR')} - ${a.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}`).join('\n')
                               : "Sin turnos"}
                          </td>
                          <td className="no-print">
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button className="btn btn-primary" onClick={() => handleSavePatient(patient.id)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "70px" }}>
                                Guardar
                              </button>
                              <button className="btn btn-outline" onClick={() => setEditingPatientId(null)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "70px" }}>
                                Cerrar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={patient.id}>
                        <td>{patient.dni}</td>
                        <td style={{ fontWeight: "600", color: "var(--color-primary-dark)" }}>{patient.nombre}</td>
                        <td>{patient.edad ?? "-"}</td>
                        <td>{patient.direccion || "-"}</td>
                        <td>{patient.telefono}</td>
                        <td>{patient.mail}</td>
                        <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>{patient.observaciones || "-"}</td>
                        <td style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", whiteSpace: "pre-wrap" }}>
                          {patient.appointments && patient.appointments.length > 0 
                            ? patient.appointments.map((a: any) => `${new Date(a.date).toLocaleDateString('es-AR')} - ${a.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}`).join('\n')
                            : "Sin turnos"}
                        </td>
                        <td className="no-print">
                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            <button className="btn btn-outline" onClick={() => handleEditPatientClick(patient)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", width: "70px" }}>
                              Editar
                            </button>
                            <button className="btn btn-outline" onClick={() => handleDeletePatient(patient.id)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", width: "70px", color: "#b91c1c", borderColor: "#b91c1c" }}>
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="glass-card" style={{ width: "400px" }}>
            <h3>Cambiar Contraseña</h3>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label className="form-label">Nueva Contraseña</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input" />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
              <button className="btn btn-outline" onClick={() => setShowPasswordModal(false)}>Cerrar</button>
              <button className="btn btn-primary" onClick={changePassword}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule/Edit Modal */}
      {showRescheduleModal && editingApp && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "2rem" }}>
          <div className="glass-card modal-animate" style={{ width: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3>Modificar Turno y Datos del Paciente</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              {/* Turno Info */}
              <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: "1rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>Horario</h4>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Fecha</label>
                    <input type="date" value={newDate} onChange={handleDateChange} className="form-input" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Hora</label>
                    <select value={newTime} onChange={e => setNewTime(e.target.value)} className="form-input">
                       <option value="">Selecciona hora</option>
                       {availableSlots.map(slot => (
                         <option key={slot} value={slot}>{slot}</option>
                       ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Patient Data */}
              <div style={{ gridColumn: "1 / -1" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>Datos del Paciente</h4>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input type="text" name="nombre" value={patientData.nombre} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">DNI *</label>
                <input type="text" name="dni" value={patientData.dni} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Edad</label>
                <input type="number" name="edad" value={patientData.edad} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="telefono" value={patientData.telefono} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="mail" value={patientData.mail} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input type="text" name="direccion" value={patientData.direccion} onChange={handlePatientDataChange} className="form-input" />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Motivo de la consulta / Observaciones</label>
                <textarea name="observaciones" value={patientData.observaciones} onChange={handlePatientDataChange} className="form-input" rows={3}></textarea>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
              <button className="btn btn-outline" onClick={() => setShowRescheduleModal(false)}>Cerrar</button>
              <button className="btn btn-primary" onClick={submitReschedule} disabled={!newDate || !newTime || !patientData.nombre || !patientData.dni}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Configuration Modal */}
      {showConfigModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
          <div className="glass-card modal-animate" style={{ backgroundColor: "white", color: "var(--color-text-main)", maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", position: "relative" }}>
            <button onClick={() => setShowConfigModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)" }}>✖</button>
            <h2 style={{ color: "var(--color-primary-dark)", marginBottom: "1.5rem" }}>Configurar Días de Atención</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <button className="btn btn-outline" onClick={() => {
                if (confirm("¿Deseas habilitar automáticamente todos los Lunes, Martes y Viernes de este mes? (Lun/Vie 11-18hs y Mar 14-18hs)")) {
                   fetch("/api/admin/availability", {
                     method: "POST", headers: {"Content-Type":"application/json"},
                     body: JSON.stringify({ action: "FILL_MONTH", year: configYear, month: configMonth })
                   }).then(() => loadConfigDates());
                }
              }}>✨ Auto-rellenar mes (Lun, Mar, Vie)</button>
            </div>

            <div className="calendar-container">
              <div className="calendar-header">
                <button type="button" className="calendar-nav-btn" onClick={() => {
                  setSelectedConfigDate(null);
                  if (configMonth === 0) { setConfigMonth(11); setConfigYear(configYear - 1); }
                  else { setConfigMonth(configMonth - 1); }
                }}>&larr;</button>
                <span className="calendar-month-title">
                  {new Date(configYear, configMonth).toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase()}
                </span>
                <button type="button" className="calendar-nav-btn" onClick={() => {
                  setSelectedConfigDate(null);
                  if (configMonth === 11) { setConfigMonth(0); setConfigYear(configYear + 1); }
                  else { setConfigMonth(configMonth + 1); }
                }}>&rarr;</button>
              </div>

              <div className="calendar-grid-weekdays">
                <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
              </div>

              <div className="calendar-grid-days">
                {Array.from({ length: new Date(configYear, configMonth, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day-empty" />
                ))}

                {Array.from({ length: new Date(configYear, configMonth + 1, 0).getDate() }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${configYear}-${(configMonth + 1).toString().padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;
                  const isConfigured = configDates.find(d => d.date.startsWith(dateStr));

                  let cellClass = "calendar-day-cell";
                  if (isConfigured) cellClass += " calendar-day-available";
                  if (selectedConfigDate === dateStr) cellClass += " calendar-day-selected";

                  return (
                    <button
                      key={`day-${dayNum}`}
                      className={cellClass}
                      onClick={() => {
                        setSelectedConfigDate(dateStr);
                        if (isConfigured) {
                          setConfigStartTime(isConfigured.startTime);
                          setConfigEndTime(isConfigured.endTime);
                        } else {
                          setConfigStartTime("11:00");
                          setConfigEndTime("18:00");
                        }
                      }}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedConfigDate && (
              <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "8px", border: "1px solid #eee" }}>
                <h3 style={{ marginBottom: "1rem" }}>Día seleccionado: {selectedConfigDate}</h3>
                
                {configDates.find(d => d.date.startsWith(selectedConfigDate)) ? (
                  <div>
                    <p style={{ color: "green", fontWeight: "bold", marginBottom: "1rem" }}>✅ Este día está HABILITADO para turnos.</p>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Hora de Inicio</label>
                        <input type="time" className="form-input" value={configStartTime} onChange={e => setConfigStartTime(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Último Turno</label>
                        <input type="time" className="form-input" value={configEndTime} onChange={e => setConfigEndTime(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button className="btn btn-primary" onClick={async () => {
                        await fetch("/api/admin/availability", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "UPDATE", date: selectedConfigDate, startTime: configStartTime, endTime: configEndTime })
                        });
                        loadConfigDates();
                        alert("Horario actualizado");
                      }}>Guardar Horario</button>
                      <button className="btn btn-outline" style={{ color: "#b91c1c", borderColor: "#b91c1c" }} onClick={async () => {
                        await fetch("/api/admin/availability", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "TOGGLE", date: selectedConfigDate })
                        });
                        loadConfigDates();
                      }}>Deshabilitar este día (Cerrar)</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#b91c1c", fontWeight: "bold", marginBottom: "1rem" }}>❌ Este día está CERRADO (no hay turnos).</p>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Hora de Inicio</label>
                        <input type="time" className="form-input" value={configStartTime} step="3600" onChange={e => setConfigStartTime(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Último Turno</label>
                        <input type="time" className="form-input" value={configEndTime} step="3600" onChange={e => setConfigEndTime(e.target.value)} />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={async () => {
                      await fetch("/api/admin/availability", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "TOGGLE", date: selectedConfigDate, startTime: configStartTime, endTime: configEndTime })
                      });
                      loadConfigDates();
                    }}>Habilitar este día</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
