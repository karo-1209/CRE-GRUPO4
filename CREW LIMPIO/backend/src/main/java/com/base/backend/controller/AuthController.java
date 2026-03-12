package com.base.backend.controller;

import com.base.backend.controller.dto.ForgotPasswordRequest;
import com.base.backend.controller.dto.LoginRequest;
import com.base.backend.controller.dto.ResetPasswordRequest;
import com.base.backend.model.Usuario;
import com.base.backend.model.BitacoraActividad;
import com.base.backend.repository.BitacoraRepository;
import com.base.backend.service.PasswordResetService;
import com.base.backend.service.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordResetService passwordResetService;
    private final BitacoraRepository bitacoraRepository;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        try {

            String ip = httpRequest.getRemoteAddr();

            Usuario usuario = usuarioService.login(
                    request.getCorreo(),
                    request.getPassword(),
                    ip);

            // REGISTRAR AUDITORÍA LOGIN EXITOSO
            BitacoraActividad bitacora = new BitacoraActividad();
            bitacora.setUsuario(usuario);
            bitacora.setAccion("LOGIN_EXITOSO");
            bitacora.setFechaEvento(LocalDateTime.now());

            bitacoraRepository.save(bitacora);

            usuario.setPassword(null);

            return ResponseEntity.ok(usuario);

        } catch (RuntimeException e) {

            // REGISTRAR LOGIN FALLIDO
            BitacoraActividad bitacora = new BitacoraActividad();
            bitacora.setAccion("LOGIN_FALLIDO");
            bitacora.setFechaEvento(LocalDateTime.now());

            bitacoraRepository.save(bitacora);

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // HU7 RECUPERAR CONTRASEÑA
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {

        String ip = httpRequest.getRemoteAddr();

        passwordResetService.requestPasswordReset(request.getEmail(), ip);

        // REGISTRAR EVENTO
        BitacoraActividad bitacora = new BitacoraActividad();
        bitacora.setAccion("SOLICITUD_RECUPERAR_PASSWORD");
        bitacora.setFechaEvento(LocalDateTime.now());

        bitacoraRepository.save(bitacora);

        return ResponseEntity.ok("Si el correo existe, se enviará un enlace de recuperación.");
    }

    // HU8 RESTABLECER CONTRASEÑA
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {

        try {

            String ip = httpRequest.getRemoteAddr();

            passwordResetService.resetPassword(request.getToken(), request.getNewPassword(), ip);

            // REGISTRAR EVENTO
            BitacoraActividad bitacora = new BitacoraActividad();
            bitacora.setAccion("CAMBIO_PASSWORD");
            bitacora.setFechaEvento(LocalDateTime.now());

            bitacoraRepository.save(bitacora);

            return ResponseEntity.ok("Contraseña actualizada correctamente.");

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}