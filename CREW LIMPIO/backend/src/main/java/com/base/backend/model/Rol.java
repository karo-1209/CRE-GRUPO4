package com.base.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_rol")
    private Integer id;

    private String nombre;
    private String descripcion;
}
