package com.hrm.hrm_saas.modules.leave.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.leave.entity.LeaveType;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, String> {

    Optional<LeaveType> findByTenantIdAndCode(String tenantId, String Code);

    Optional<LeaveType> findByTenantIdAndName(String tenantId, String name);

    Optional<LeaveType> findByIdAndTenantId(String id, String tenantId);
}