package com.hrm.hrm_saas.modules.payroll.repository;

import com.hrm.hrm_saas.modules.payroll.entity.BankDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BankDetailsRepository extends JpaRepository<BankDetails, String> {
    Optional<BankDetails> findFirstByEmployeeIdAndTenantId(Long employeeId, String tenantId);
}
