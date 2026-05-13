package com.hrm.hrm_saas.modules.shift.repository;

import com.hrm.hrm_saas.modules.shift.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, String> {
    List<Shift> findByTenantId(String tenantId);
    Optional<Shift> findByIdAndTenantId(String id, String tenantId);
    void deleteByTenantId(String tenantId);
}
