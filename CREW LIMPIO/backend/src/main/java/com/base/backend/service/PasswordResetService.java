package com.base.backend.service;

import com.base.backend.model.PasswordResetToken;
import com.base.backend.model.Usuario;
import com.base.backend.model.BitacoraActividad;
import com.base.backend.repository.BitacoraRepository;
import com.base.backend.repository.PasswordResetTokenRepository;
import com.base.backend.repository.UsuarioRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final BitacoraRepository bitacoraRepository;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordResetTokenRepository tokenRepository,
                                JavaMailSender mailSender,
                                BitacoraRepository bitacoraRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.bitacoraRepository = bitacoraRepository;
    }

    /** HU7: solicitar recuperación. Respuesta debe ser siempre genérica. */
    public void requestPasswordReset(String email, String ipOrigen) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(email);

        // Siempre invalidar tokens anteriores si el correo existe (si no existe, no pasa nada).
        tokenRepository.deleteByEmail(email);

        // Registrar evento de solicitud (no revela al cliente si existe)
        BitacoraActividad eventoReq = new BitacoraActividad();
        usuarioOpt.ifPresent(eventoReq::setUsuario);
        eventoReq.setAccion("PASSWORD_RESET_REQUEST");
        eventoReq.setDescripcion("Solicitud de restablecimiento para email: " + email);
        eventoReq.setIpOrigen(ipOrigen);
        bitacoraRepository.save(eventoReq);

        if (usuarioOpt.isEmpty()) {
            // No revelar existencia del correo: salimos sin error
            return;
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setEmail(email);
        prt.setToken(token);
        prt.setExpiracion(expiracion);

        tokenRepository.save(prt);

        // Enlace al frontend (ajusta ruta si tu UI usa otra)
        String link = "http://localhost:3000/reset-password?token=" + token;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Recuperación de contraseña");
        msg.setText("Usa este enlace para restablecer tu contraseña (expira en 15 minutos):\n" + link);

        mailSender.send(msg);
    }

    /** HU8: restablecer contraseña con token válido y no expirado */
    public void resetPassword(String token, String newPassword, String ipOrigen) {

        Usuario usuario = null;
        PasswordResetToken prt = null;

        try {
            // Validación de contraseña mínima
            if (newPassword == null || newPassword.length() < 4) {
                throw new RuntimeException("La contraseña debe tener al menos 4 caracteres");
            }

            prt = tokenRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Token inválido"));

            if (prt.getExpiracion().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Token expirado");
            }

            usuario = usuarioRepository.findByCorreo(prt.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // IMPORTANTE: tu login compara texto plano, así que guardamos texto plano.
            usuario.setPassword(newPassword);
            usuarioRepository.save(usuario);

            // Invalida el token (evita reuso)
            tokenRepository.delete(prt);

            // Registrar éxito
            BitacoraActividad eventoOk = new BitacoraActividad();
            eventoOk.setUsuario(usuario);
            eventoOk.setAccion("PASSWORD_RESET_SUCCESS");
            eventoOk.setDescripcion("Restablecimiento de contraseña exitoso para usuario id: " + (usuario != null ? usuario.getId() : "?"));
            eventoOk.setIpOrigen(ipOrigen);
            bitacoraRepository.save(eventoOk);

        } catch (RuntimeException ex) {
            // Registrar fallo
            BitacoraActividad eventoFail = new BitacoraActividad();
            if (usuario != null) eventoFail.setUsuario(usuario);
            else if (prt != null) {
                // intentar asociar usuario si existe
                usuarioRepository.findByCorreo(prt.getEmail()).ifPresent(eventoFail::setUsuario);
            }
            eventoFail.setAccion("PASSWORD_RESET_FAIL");
            eventoFail.setDescripcion("Fallo en restablecimiento de contraseña: " + ex.getMessage());
            eventoFail.setIpOrigen(ipOrigen);
            bitacoraRepository.save(eventoFail);

            throw ex;
        }
    }
}
