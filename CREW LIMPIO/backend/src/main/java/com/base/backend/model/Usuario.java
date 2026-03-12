package com.base.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_usuario")
    private Integer id;

    private String nombre;
    private String correo;
    private String username;

    @Column(name="password_hash")
    private String password;

    @ManyToOne
    @JoinColumn(name="id_rol")
    private Rol rol;

    private Boolean estado;

    //H09 , H10
    @Column(name ="cuenta_bloqueada")
    private Boolean cuenta_bloqueada;

    @Column(name = "intentos_fallidos")
    private Integer intentosFallidos;

}
