import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecuperarPassword from "./pages/RecuperarPassword";
import ResetPassword from "./pages/ResetPassword";
import Auditoria from "./pages/Auditoria";
import Usuarios from "./pages/Usuarios";

import InactivityHandler from "./components/InactivityHandler";

function App() {

  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario"))
  );

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= */}
        {/* RUTAS PUBLICAS */}
        {/* ================= */}

        <Route
          path="/"
          element={<Login onLogin={setUsuario} />}
        />

        <Route
          path="/recuperar"
          element={<RecuperarPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ================= */}
        {/* DASHBOARD */}
        {/* ================= */}

        <Route
          path="/dashboard"
          element={
            usuario ? (
              <InactivityHandler onLogout={cerrarSesion}>
                <Dashboard usuario={usuario} onLogout={cerrarSesion} />
              </InactivityHandler>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= */}
        {/* AUDITORIA */}
        {/* ================= */}

        <Route
          path="/auditoria"
          element={
            usuario ? (
              <InactivityHandler onLogout={cerrarSesion}>
                <Auditoria />
              </InactivityHandler>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= */}
        {/* HU9 - USUARIOS */}
        {/* ================= */}

        <Route
          path="/usuarios"
          element={
            usuario ? (
              <InactivityHandler onLogout={cerrarSesion}>
                <Usuarios />
              </InactivityHandler>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= */}
        {/* REDIRECCION GLOBAL */}
        {/* ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={usuario ? "/dashboard" : "/"}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;