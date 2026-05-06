package com.hrm.hrm_saas.modules.role.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.hrm.hrm_saas.modules.role.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    List<Role> findByTenantId(String tenantId);
    java.util.Optional<Role> findByNameAndTenantId(String name, String tenantId);
}