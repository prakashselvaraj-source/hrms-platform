package com.hrm.hrm_saas.modules.payroll.service;

import com.hrm.hrm_saas.modules.payroll.dto.BankDetailsDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayslipResponseDTO;
import com.hrm.hrm_saas.modules.payroll.dto.AdminPayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.entity.PayrollPolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayrollService {
    PayrollOverviewDTO getOverview(String tenantId, String email);
    Page<PayslipResponseDTO> getPayslips(String tenantId, String email, Pageable pageable);
    BankDetailsDTO getBankDetails(String tenantId, String email);
    BankDetailsDTO updateBankDetails(String tenantId, String email, BankDetailsDTO bankDetailsDTO);
    Object getSalaryStructure(String tenantId, String email);
    byte[] downloadPayslip(String tenantId, String payslipId);
    void seedData(String tenantId, String email);
    void seedAllEmployeesData(String tenantId);

    
    // Admin methods
    AdminPayrollOverviewDTO getAdminOverview(String tenantId);
    void runPayrollCycle(String tenantId);
    PayrollPolicy getPayrollPolicy(String tenantId);
    PayrollPolicy updatePayrollPolicy(String tenantId, PayrollPolicy policy);
    com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO getPayrollHistory(String tenantId, int page, int size, String year);
    void finalizePayouts(String tenantId);

    // Salary Structure Methods
    com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO getEmployeeSalaryStructure(Long employeeId, String tenantId);
    com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO updateEmployeeSalaryStructure(Long employeeId, String tenantId, com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO dto);
}
