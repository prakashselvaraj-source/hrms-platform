package com.hrm.hrm_saas.modules.payroll.repository;

import com.hrm.hrm_saas.modules.payroll.entity.PayrollPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PayrollPolicyRepository extends JpaRepository<PayrollPolicy, Long> {
    Optional<PayrollPolicy> findByTenantId(String tenantId);
}
