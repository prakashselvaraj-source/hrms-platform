package com.hrm.hrm_saas.modules.leave.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.leave.entity.LeavePolicy;

public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, String> {

    List<LeavePolicy> findByTenantId(String tenantId);
    Optional<LeavePolicy> findByLeaveType_Id(String leaveTypeId);

    Optional<LeavePolicy> findByLeaveType_IdAndTenantId(
        String leaveTypeId,
        String tenantId
    );

       Optional<LeavePolicy> findByTenantIdAndLeaveType_Id(String tenantId, String leaveTypeId);

}