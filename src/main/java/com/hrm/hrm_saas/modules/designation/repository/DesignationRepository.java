package com.hrm.hrm_saas.modules.designation.repository;

import com.hrm.hrm_saas.modules.designation.entity.Designation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, String> {
    Page<Designation> findByTenantId(String tenantId, Pageable pageable);
    List<Designation> findByTenantId(String tenantId);
    Optional<Designation> findByIdAndTenantId(String id, String tenantId);
}
