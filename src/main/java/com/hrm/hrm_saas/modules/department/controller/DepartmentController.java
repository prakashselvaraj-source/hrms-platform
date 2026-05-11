package com.hrm.hrm_saas.modules.department.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.department.model.DepartmentDTO;
import com.hrm.hrm_saas.modules.department.service.DepartmentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin("*")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(@RequestBody DepartmentDTO departmentDTO,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        departmentDTO.setTenantId(tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(departmentDTO));
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments(@RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(departmentService.getAllDepartments(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable String id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(departmentService.getDepartmentById(tenantId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable String id,
            @RequestBody DepartmentDTO departmentDTO,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(departmentService.updateDepartment(tenantId, id, departmentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        departmentService.deleteDepartment(tenantId, id);
        return ResponseEntity.noContent().build();
    }

}
