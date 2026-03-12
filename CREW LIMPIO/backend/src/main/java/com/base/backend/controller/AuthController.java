package com.base.backend.controller;

import com.base.backend.controller.dto.ForgotPasswordRequest;
import com.base.backend.controller.dto.LoginRequest;
import com.base.backend.controller.dto.ResetPasswordRequest;
import com.base.backend.model.Usuario;
import com.base.backend.service.PasswordResetService;
import com.base.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = {"http://localhost:3000"})
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordResetService passwordResetService;

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        try {

            String ip = httpRequest.getRemoteAddr();

            Usuario usuario = usuarioService.login(
                request.getCorreo(),
                request.getPassword(),
                ip
            );

            usuario.setPassword(null); // no enviar password

            return ResponseEntity.ok(usuario);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // HU7
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        passwordResetService.requestPasswordReset(request.getEmail(), ip);
        return ResponseEntity.ok("Si el correo existe, se enviará un enlace de recuperación.");
    }

    // HU8
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        try {
            String ip = httpRequest.getRemoteAddr();
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword(), ip);
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
