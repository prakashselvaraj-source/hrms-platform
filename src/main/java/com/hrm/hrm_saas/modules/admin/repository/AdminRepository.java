package com.hrm.hrm_saas.modules.admin.repository;

import com.hrm.hrm_saas.modules.admin.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUserId(Long userId);
    Optional<Admin> findByTenantIdAndUserId(Long tenantId, Long userId);
}
