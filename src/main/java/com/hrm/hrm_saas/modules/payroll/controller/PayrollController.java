package com.hrm.hrm_saas.modules.payroll.controller;

import com.hrm.hrm_saas.modules.payroll.dto.AdminPayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.dto.BankDetailsDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayslipResponseDTO;
import com.hrm.hrm_saas.modules.payroll.entity.PayrollPolicy;
import com.hrm.hrm_saas.modules.payroll.service.PayrollService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/overview")
    public ResponseEntity<PayrollOverviewDTO> getOverview(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        System.out.println("PayrollController.getOverview: tenantId=" + tenantId + ", email=" + email);
        return ResponseEntity.ok(payrollService.getOverview(tenantId, email));
    }

    @GetMapping("/payslips")
    public ResponseEntity<Page<PayslipResponseDTO>> getPayslips(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        System.out.println("PayrollController.getPayslips: tenantId=" + tenantId + ", email=" + email);
        return ResponseEntity.ok(payrollService.getPayslips(tenantId, email, PageRequest.of(page, size)));
    }

    @GetMapping("/payslips/{id}/download")
    public ResponseEntity<byte[]> downloadPayslip(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable String id) {
        byte[] pdfContent = payrollService.downloadPayslip(tenantId, id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=payslip-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/salary-structure")
    public ResponseEntity<Object> getSalaryStructure(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return ResponseEntity.ok(payrollService.getSalaryStructure(tenantId, email));
    }

    @GetMapping("/bank-details")
    public ResponseEntity<BankDetailsDTO> getBankDetails(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return ResponseEntity.ok(payrollService.getBankDetails(tenantId, email));
    }

    @PutMapping("/bank-details")
    public ResponseEntity<BankDetailsDTO> updateBankDetails(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody BankDetailsDTO bankDetailsDTO,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return ResponseEntity.ok(payrollService.updateBankDetails(tenantId, email, bankDetailsDTO));
    }

    @PostMapping("/seed")
    public ResponseEntity<String> seedData(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        payrollService.seedData(tenantId, email);
        return ResponseEntity.ok("Sample data generated successfully for " + email);
    }

    // Admin Endpoints
    @GetMapping("/admin/overview")
    public ResponseEntity<AdminPayrollOverviewDTO> getAdminOverview(
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(payrollService.getAdminOverview(tenantId));
    }

    @PostMapping("/admin/run-cycle")
    public ResponseEntity<String> runPayrollCycle(
            @RequestHeader("X-Tenant-Id") String tenantId) {
        payrollService.runPayrollCycle(tenantId);
        return ResponseEntity.ok("Payroll cycle executed successfully for all employees.");
    }

    @GetMapping("/admin/policy")
    public ResponseEntity<PayrollPolicy> getPayrollPolicy(
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(payrollService.getPayrollPolicy(tenantId));
    }

    @PutMapping("/admin/policy")
    public ResponseEntity<PayrollPolicy> updatePayrollPolicy(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody PayrollPolicy policy) {
        return ResponseEntity.ok(payrollService.updatePayrollPolicy(tenantId, policy));
    }

    @GetMapping("/admin/payslips")
    public ResponseEntity<Page<PayslipResponseDTO>> getAllPayslips(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(payrollService.getPayslips(tenantId, null, PageRequest.of(page, size)));
    }

    @GetMapping("/admin/salary-structure/{employeeId}")
    public ResponseEntity<com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO> getEmployeeSalaryStructure(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable("employeeId") Long employeeId,
            HttpServletRequest request) {
        
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(payrollService.getEmployeeSalaryStructure(employeeId, tenantId));
    }

    @PutMapping("/admin/salary-structure/{employeeId}")
    public ResponseEntity<com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO> updateEmployeeSalaryStructure(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable("employeeId") Long employeeId,
            @RequestBody com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO dto,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(payrollService.updateEmployeeSalaryStructure(employeeId, tenantId, dto));
    }

    @GetMapping("/admin/history")
    public ResponseEntity<com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO> getAllPayrollHistory(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String year) {
        return ResponseEntity.ok(payrollService.getPayrollHistory(tenantId, page, size, year));
    }
}

