import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecuperarPassword from "./pages/RecuperarPassword";
import ResetPassword from "./pages/ResetPassword";
import Auditoria from "./pages/Auditoria";
// 1. IMPORTA EL SENSOR QUE CREAMOS
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
        {/* Rutas Públicas - No llevan sensor */}
        <Route path="/" element={<Login onLogin={setUsuario} />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas Protegidas - AQUÍ ENVOLVEMOS CON EL SENSOR */}
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

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;