import { useState } from "react";
import api from "../api/api";

export default function RecuperarPassword() {

  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");

    try {
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      // ignoramos errores intencionalmente
    }

    // siempre mostramos el mismo mensaje
    setMensaje("Si el correo está registrado, recibirás instrucciones.");
    setEmail("");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Recuperar contraseña</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Enviar</button>

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      </form>
    </div>
  );
}