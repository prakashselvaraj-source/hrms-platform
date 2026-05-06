package com.hrm.hrm_saas.modules.resignation.repository;

import com.hrm.hrm_saas.modules.resignation.model.Resignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ResignationRepository extends JpaRepository<Resignation, Long> {
    List<Resignation> findByTenantId(String tenantId);
    Page<Resignation> findByTenantId(String tenantId, Pageable pageable);
    List<Resignation> findByEmployeeIdAndTenantId(Long employeeId, String tenantId);
    Page<Resignation> findByEmployeeIdAndTenantId(Long employeeId, String tenantId, Pageable pageable);
}
