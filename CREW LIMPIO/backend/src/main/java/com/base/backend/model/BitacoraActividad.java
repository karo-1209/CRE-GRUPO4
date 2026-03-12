package com.base.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_actividad")
@Data
public class BitacoraActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvento;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    private String accion;
    private String descripcion;

    @Column(name = "fecha_evento", insertable = false,updatable = false)
    private LocalDateTime fechaEvento;

    private String ipOrigen;
}
