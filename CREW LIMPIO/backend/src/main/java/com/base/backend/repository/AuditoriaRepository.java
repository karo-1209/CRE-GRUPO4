package com.base.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.base.backend.model.Auditoria;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {
}