import React, { useEffect, useRef } from 'react';
import Swal from 'sweetalert2'; 

const InactivityHandler = ({ children, onLogout }) => {
  const timerRef = useRef(null);

  // 1. Acción Final: Cerrar sesión y avisar al Backend (Criterio 6)
  const ejecutarCierre = async () => {
    try {
      const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
      if (datosUsuario) {
        // Registro en tu tabla auditoria_accesos
        await fetch('http://localhost:8080/api/auditoria/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: datosUsuario.id_usuario || datosUsuario.id, 
            evento: 'LOGOUT_INACTIVIDAD',
            fecha: new Date() 
          })
        });
      }
    } catch (error) {
      console.error("Error en auditoría:", error);
    }

    onLogout(); 
    Swal.fire({
      title: 'Sesión expirada',
      text: 'Tu sesión se cerró por inactividad.',
      icon: 'info',
      confirmButtonColor: '#3085d6'
    });
  };

  // 2. Gestión del tiempo (120,000ms = 2 minutos)
  const reiniciarCronometro = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      Swal.fire({
        title: '¿Sigues ahí?',
        text: 'Tu sesión está a punto de expirar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Mantener sesión',
        cancelButtonText: 'Cerrar ahora',
        timer: 30000, 
        timerProgressBar: true,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          reiniciarCronometro(); 
        } else {
          ejecutarCierre(); 
        }
      });
    }, 120000); 
  };

  // 4. CONFIGURACIÓN DE SENSORES (Lo que preguntaste)
  useEffect(() => {
    const eventos = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const manejarActividad = () => reiniciarCronometro();

    // Iniciar sensores
    eventos.forEach(ev => window.addEventListener(ev, manejarActividad));
    
    // Iniciar cronómetro al cargar
    reiniciarCronometro();

    // Limpieza al desmontar el componente
    return () => {
      eventos.forEach(ev => window.removeEventListener(ev, manejarActividad));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return <React.Fragment>{children}</React.Fragment>; 
};

export default InactivityHandler;