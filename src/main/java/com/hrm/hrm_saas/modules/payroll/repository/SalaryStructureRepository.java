package com.hrm.hrm_saas.modules.payroll.repository;

import com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {
    
    Optional<SalaryStructure> findFirstByEmployeeIdAndTenantId(Long employeeId, String tenantId);
    
    List<SalaryStructure> findByTenantId(String tenantId);
    
    Optional<SalaryStructure> findFirstByEmployeeIdAndTenantIdAndStatus(Long employeeId, String tenantId, SalaryStructure.SalaryStructureStatus status);
    
    List<SalaryStructure> findByTenantIdAndStatus(String tenantId, SalaryStructure.SalaryStructureStatus status);
}
