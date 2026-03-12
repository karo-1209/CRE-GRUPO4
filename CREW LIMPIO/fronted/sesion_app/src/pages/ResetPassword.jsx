import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!token) {
      setError("Token no encontrado en la URL.");
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMensaje("Contraseña actualizada. Ya puedes iniciar sesión.");
      setNewPassword("");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err?.response?.data || "No se pudo restablecer la contraseña.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Restablecer contraseña</h2>

      {!token && (
        <p style={{ color: "red" }}>
          No se encontró token. Abre el enlace que llegó a tu correo.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Guardar</button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
