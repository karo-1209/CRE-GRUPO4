package com.base.backend.controller;

import com.base.backend.model.BitacoraActividad;
import com.base.backend.model.Usuario;
import com.base.backend.repository.BitacoraRepository;
import com.base.backend.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private BitacoraRepository bitacoraRepository;

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @PutMapping("/usuarios/{id}/desactivar")
    public ResponseEntity<String> desactivarUsuario(@PathVariable Integer id, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        Usuario adminSimulado = new Usuario();
        adminSimulado.setId(1);
        usuarioService.desactivarCuenta(id, adminSimulado, ip);
        return ResponseEntity.ok("Usuario desactivado correctamente");
    }

    @PutMapping("/usuarios/{id}/desbloquear")
    public ResponseEntity<String> desbloquearUsuario(@PathVariable Integer id, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        Usuario adminSimulado = new Usuario();
        adminSimulado.setId(1);
        usuarioService.desbloquearCuenta(id, adminSimulado, ip);
        return ResponseEntity.ok("Cuenta desbloqueada correctamente");
    }

    @GetMapping("/auditoria")
    public ResponseEntity<List<BitacoraActividad>> verAuditoria(@org.springframework.web.bind.annotation.RequestParam(required = false) String accion) {
        if (accion != null && !accion.isEmpty()) {
            return ResponseEntity.ok(bitacoraRepository.findByAccionOrderByFechaEventoDesc(accion));
        }
        return ResponseEntity.ok(bitacoraRepository.findAllByOrderByFechaEventoDesc());
    }
}
