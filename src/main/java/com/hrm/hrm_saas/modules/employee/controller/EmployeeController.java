package com.hrm.hrm_saas.modules.employee.controller;

import java.util.List;

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
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees(
            @RequestParam(required = false) OnboardingStatus status,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (status != null) {
            return ResponseEntity.ok(service.getEmployeesByStatus(status, tenantId));
        }
        System.out.println("EmployeeController");
        return ResponseEntity.ok(service.getAllEmployees(tenantId));
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
        System.out.println("tokenTenantId"+tokenTenantId);
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("EmployeeDTO");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createEmployee(dto, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.updateEmployee(id, dto, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        service.deleteEmployee(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
