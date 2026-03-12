package com.base.backend.repository;

import com.base.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Buscar usuario por correo (para login)
    Optional<Usuario> findByCorreo(String correo);

}
