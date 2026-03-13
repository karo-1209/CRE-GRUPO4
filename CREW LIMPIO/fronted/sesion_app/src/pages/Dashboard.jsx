import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard({ usuario, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) navigate("/");
  }, [usuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    onLogout();
    navigate("/");
  };

  if (!usuario) return null;

  // Cambia esto en Dashboard.jsx
  const nombreRol = usuario.rol?.nombre || usuario.rol;
  const isAdmin = nombreRol === "Admin"; // <-- Asegúrate que sea "Admin" como en tu SQL

  return (
    <div className="dash-bg">
      <div className="dash-shell">
        {/* Header */}
        <header className="dash-header">
          <div className="dash-brand" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
            <div className="dash-logo" />
            <div>
              <h1>CRE</h1>
              <p>Panel principal</p>
            </div>
          </div>

          <div className="dash-actions">
            {isAdmin && (
              <button className="dash-btn ghost" onClick={() => navigate("/auditoria")}>
                Ver auditoría
              </button>
            )}
            <button className="dash-btn danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dash-grid">
          <section className="dash-card">
            <div className="dash-card-title">
              <h2>Bienvenido, {usuario.nombre || usuario.username}</h2>
              {/* CORRECCIÓN: Mostramos solo el nombre del rol, no el objeto completo */}
              <span className="dash-pill">{nombreRol || "Usuario"}</span>
            </div>

            <div className="dash-info">
              <div className="dash-info-item">
                <span className="k">Correo</span>
                <span className="v">{usuario.correo}</span>
              </div>
              <div className="dash-info-item">
                <span className="k">Usuario</span>
                <span className="v">{usuario.username || "N/A"}</span>
              </div>
              <div className="dash-info-item">
                <span className="k">Estado</span>
                <span className={`v ${usuario.estado === false ? "bad" : "ok"}`}>
                  {usuario.estado === false ? "Desactivado" : "Activo"}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="dash-hint">
                Usa el botón <b>“Ver auditoría”</b> para revisar accesos y acciones críticas del sistema.
              </div>
            )}
          </section>

          <section className="dash-card">
            <div className="dash-card-title">
              <h2>Acciones rápidas</h2>
              <span className="dash-sub">
                {isAdmin ? "Administración" : "Consultas"}
              </span>
            </div>

            <div className="dash-actions-grid">
              {isAdmin && (
                <button className="dash-tile" onClick={() => navigate("/auditoria")}>
                  <div className="tile-icon">📋</div>
                  <div className="tile-text">
                    <div className="tile-title">Auditoría</div>
                    <div className="tile-desc">Ver actividad del sistema</div>
                  </div>
                </button>
              )}

              {isAdmin && (
                <button className="dash-tile" onClick={() => navigate("/usuarios")}>
                  <div className="tile-icon">👥</div>
                  <div className="tile-text">
                    <div className="tile-title">Usuarios</div>
                    <div className="tile-desc">Gestionar usuarios del sistema</div>
                  </div>
                </button>
              )}

              <button className="dash-tile" onClick={() => alert("Módulo de Reportes")}>
                <div className="tile-icon">📈</div>
                <div className="tile-text">
                  <div className="tile-title">Reportes</div>
                  <div className="tile-desc">Resumen y métricas</div>
                </div>
              </button>
            </div>
          </section>
        </main>

        <footer className="dash-footer">
          <span>© {new Date().getFullYear()} CRE · Dashboard</span>
        </footer>
      </div>
    </div>
  );
}