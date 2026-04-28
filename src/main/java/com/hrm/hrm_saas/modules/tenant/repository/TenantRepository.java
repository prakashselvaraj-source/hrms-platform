package com.hrm.hrm_saas.modules.tenant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByCompanyCode(String companyCode);
}