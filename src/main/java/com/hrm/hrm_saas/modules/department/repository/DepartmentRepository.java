package com.hrm.hrm_saas.modules.department.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.department.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, String> {
    List<Department> findByTenantId(String tenantId);

    Optional<Department> findByTenantIdAndCode(String tenantId, String code);

    long countByTenantId(String tenantId);
}
