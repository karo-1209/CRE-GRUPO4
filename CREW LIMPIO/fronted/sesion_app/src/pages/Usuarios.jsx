import { useEffect, useState } from "react";
import api from "../api/api";

export default function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/admin/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Lista de Usuarios</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Correo</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.correo}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}