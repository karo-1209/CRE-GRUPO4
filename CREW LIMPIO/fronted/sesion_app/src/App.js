import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecuperarPassword from "./pages/RecuperarPassword";
import ResetPassword from "./pages/ResetPassword";
import Auditoria from "./pages/Auditoria";

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
        {/* Públicas */}
        <Route path="/" element={<Login onLogin={setUsuario} />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protegida */}
        <Route
          path="/dashboard"
          element={
            usuario ? (
              <Dashboard usuario={usuario} onLogout={cerrarSesion} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/auditoria"
          element={
            usuario ? (
              <Auditoria />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
