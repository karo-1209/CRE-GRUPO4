package com.base.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_token")
@Data
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 255)
    private String token;

    @Column(name = "expiracion", nullable = false)
    private LocalDateTime expiracion;

    public PasswordResetToken() {
    }

    public PasswordResetToken(String email, String token, LocalDateTime expiracion) {
        this.email = email;
        this.token = token;
        this.expiracion = expiracion;
    }
}
