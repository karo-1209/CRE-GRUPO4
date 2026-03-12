package com.base.backend.service;

import com.base.backend.model.BitacoraActividad;
import com.base.backend.model.Usuario;
import com.base.backend.repository.BitacoraRepository;
import com.base.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BitacoraRepository bitacoraRepository;

    // LOGIN (HU1 + HU3)
    public Usuario login(String correo, String password, String ipOrigen) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        Usuario usuario = usuarioOpt.get();

        // HU11
        if (usuario.getEstado() != null && !usuario.getEstado()) {
            // HU10
            RegistrarEvento(usuario, "ACCESO_DENEGADO", "Intento de login en cuenta desactivada", ipOrigen);
            throw new RuntimeException("Esta cuenta ha sido desactivada por un administrador.");
        }

        // HU09
        if (usuario.getCuenta_bloqueada() != null && usuario.getCuenta_bloqueada()) {
            RegistrarEvento(usuario, "ACCESO_DENEGADO", "Intento de login en cuenta bloqueada", ipOrigen);
            throw new RuntimeException("Su cuenta está bloqueada. Contacte al administrador.");
        }

        if (!usuario.getPassword().equals(password)) {
            // HU10
            RegistrarEvento(usuario, "ACCESO_FALLIDO", "Contraseña incorrecta", ipOrigen);
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        // HU10
        RegistrarEvento(usuario, "LOGIN", "Inicio de sesión exitoso", ipOrigen);

        return usuario;
    }

    //HU09
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    //HU11
    @Transactional
    public void desactivarCuenta(Integer id, Usuario admin, String ipOrigen) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setEstado(false);
        usuarioRepository.save(user);

        //HU10
        RegistrarEvento(admin, "DESACTIVAR_USUARIO", "Desactivó a: " + user.getUsername(), ipOrigen);
    }

    @Transactional
    public void desbloquearCuenta(Integer id, Usuario admin, String ipOrigen) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("usuario no encontrado"));
        user.setCuenta_bloqueada(false);
        user.setIntentosFallidos(0);
        usuarioRepository.save(user);

        RegistrarEvento(admin, "DESBLOQUEAR_CUENTA", "DESBLOQUEO A" + user.getUsername(), ipOrigen);
    }

    private void RegistrarEvento(Usuario admin, String accion, String desc, String ipOrigen) {
        BitacoraActividad evento = new BitacoraActividad();
        evento.setUsuario(admin);
        evento.setAccion(accion);
        evento.setDescripcion(desc);
        evento.setIpOrigen(ipOrigen);
        bitacoraRepository.save(evento);
    }

}
