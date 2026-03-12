import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !password) {
      setError("Completa correo y contraseña.");
      return;
    }

    try {
      setCargando(true);
      const res = await api.post("/auth/login", { correo, password });
      localStorage.setItem("usuario", JSON.stringify(res.data));
      onLogin(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo-dot" />
          <div>
            <h1>CRE</h1>
            <p>Inicia sesión para continuar</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="login-links">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>

        <div className="login-footer">
          <span>© {new Date().getFullYear()} CRE</span>
        </div>
      </div>
    </div>
  );
}