"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="glass-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Acceso Profesional</h2>
        
        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <small style={{ color: "var(--color-text-muted)" }}>La primera vez usa: admin123</small>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
