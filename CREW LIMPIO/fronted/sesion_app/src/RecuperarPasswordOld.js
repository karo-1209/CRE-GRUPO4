import { useState } from "react";
import api from "./api/api"; // ojo ruta relativa

function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const enviarSolicitud = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setMensaje("Si el correo existe, se enviará un enlace de recuperación.");
      setEmail("");
    } catch (err) {
      setError(err?.response?.data || "Error al procesar solicitud");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Recuperar contraseña</h2>

      <form onSubmit={enviarSolicitud}>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Enviar</button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RecuperarPassword;