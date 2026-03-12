package com.base.backend.repository;

import com.base.backend.model.BitacoraActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BitacoraRepository extends JpaRepository<BitacoraActividad, Long> {

	List<BitacoraActividad> findAllByOrderByFechaEventoDesc();

	List<BitacoraActividad> findByAccionOrderByFechaEventoDesc(String accion);

}
