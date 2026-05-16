package com.hrm.hrm_saas.modules.employee.controller;

import java.util.List;

import com.hrm.hrm_saas.modules.employee.model.EmployeePageResponse;
import com.hrm.hrm_saas.modules.employee.model.EmployeeProfileDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Pageable;

import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;
import com.hrm.hrm_saas.modules.employee.service.EmployeeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @GetMapping
    public ResponseEntity<EmployeePageResponse> getAllEmployees(
            @RequestParam(required = false) OnboardingStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search,
            @RequestHeader("X-Tenant-Id") String tenantId,
            Pageable pageable,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        System.out.println("TokenTenantId" + tokenTenantId);
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.getAllEmployees(tenantId, status, department, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployee(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.print("ResponseEntity" + id);
        return ResponseEntity.ok(service.getEmployeeById(id, tenantId));
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(
            @Valid @RequestBody EmployeeDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        System.out.println("tokenTenantId" + tokenTenantId);
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("EmployeeDTO");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createEmployee(dto, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.updateEmployee(id, dto, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> deleteEmployee(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        service.deleteEmployee(id, tenantId);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Employee deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileDTO> getEmployeeProfile(
            HttpServletRequest request,
            @RequestHeader("X-Tenant-Id") String tenantId) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String mail = (String) request.getAttribute("email");

        System.out.println(mail);
        return ResponseEntity.ok(service.getEmployeeProfile(mail, tenantId));
    }

}
