import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Auditoria.css";

export default function Auditoria() {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [filtroAccion, setFiltroAccion] = useState("");
  const [buscar, setBuscar] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarAuditoria();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarAuditoria = async () => {
    try {
      setCargando(true);
      setError("");
      const res = await api.get("/admin/auditoria");
      setEventos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data || "No se pudo cargar la auditoría");
    } finally {
      setCargando(false);
    }
  };

  const eventosFiltrados = eventos.filter((e) => {
    const accionOk = !filtroAccion || (e.accion || "").toLowerCase().includes(filtroAccion.toLowerCase());
    const text = `${e.usuario?.username || ""} ${e.usuario?.correo || ""} ${e.accion || ""} ${e.descripcion || ""} ${e.ipOrigen || ""}`.toLowerCase();
    const buscarOk = !buscar || text.includes(buscar.toLowerCase());
    return accionOk && buscarOk;
  });

  return (
    <div className="aud-bg">
      <div className="aud-shell">

        <header className="aud-header">
          <div className="aud-brand" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
            <div className="aud-logo" />
            <div>
              <h1>CRE</h1>
              <p>Auditoría del sistema</p>
            </div>
          </div>

          <div className="aud-actions">
            <button className="aud-btn ghost" onClick={cargarAuditoria}>
              Recargar
            </button>
            <button className="aud-btn" onClick={() => navigate("/dashboard")}>
              Volver
            </button>
          </div>
        </header>

        <section className="aud-card">
          <div className="aud-card-title">
            <h2>Registros</h2>
            <span className="aud-sub">
              {cargando ? "Cargando..." : `${eventosFiltrados.length} evento(s)`}
            </span>
          </div>

          <div className="aud-filters">
            <input
              className="aud-input"
              placeholder="Buscar (usuario, correo, acción, descripción, IP...)"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />

            <input
              className="aud-input"
              placeholder="Filtrar por acción (ej: LOGIN, ACCESO_FALLIDO...)"
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
            />
          </div>

          {error && <div className="aud-error">{error}</div>}

          <div className="aud-table-wrap">
            <table className="aud-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Descripción</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="aud-empty">Cargando auditoría...</td>
                  </tr>
                ) : eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="aud-empty">No hay eventos para mostrar.</td>
                  </tr>
                ) : (
                  eventosFiltrados.map((e) => (
                    <tr key={e.idEvento}>
                      <td className="mono">{formatFecha(e.fechaEvento)}</td>
                      <td>
                        <div className="usercell">
                          <div className="avatar">{(e.usuario?.username || e.usuario?.correo || "U")[0]?.toUpperCase()}</div>
                          <div>
                            <div className="user-main">{e.usuario?.username || "N/A"}</div>
                            <div className="user-sub">{e.usuario?.correo || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill">{e.accion || "N/A"}</span>
                      </td>
                      <td className="desc">{e.descripcion || "—"}</td>
                      <td className="mono">{e.ipOrigen || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="aud-footer">
          <span>© {new Date().getFullYear()} CRE · Auditoría</span>
        </footer>
      </div>
    </div>
  );
}

function formatFecha(fecha) {
  if (!fecha) return "—";
  // Si viene ISO, lo mostramos amigable sin librerías
  try {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return String(fecha);
    return d.toLocaleString();
  } catch {
    return String(fecha);
  }
}