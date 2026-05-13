package com.hrm.hrm_saas.modules.location.repository;

import com.hrm.hrm_saas.modules.location.entity.WorkLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkLocationRepository extends JpaRepository<WorkLocation, String> {
    List<WorkLocation> findByTenantId(String tenantId);
    Optional<WorkLocation> findByIdAndTenantId(String id, String tenantId);
    void deleteByTenantId(String tenantId);
}
