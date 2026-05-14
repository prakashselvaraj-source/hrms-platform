package com.hrm.hrm_saas.modules.role.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import com.hrm.hrm_saas.modules.role.model.Role;
import com.hrm.hrm_saas.modules.role.model.RoleDTO;
import com.hrm.hrm_saas.modules.role.service.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
@RequiredArgsConstructor
public class RoleController {

    private final RoleService service;

    @PostMapping
    public ResponseEntity<Role> createRole(
            @Valid @RequestBody RoleDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createRole(dto, tenantId));
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.getAllRoles(tenantId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.getRoleById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.updateRole(id, dto, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> deleteRole(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        service.deleteRole(id, tenantId);

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Role deleted successfully");
        return ResponseEntity.ok(response);
    }
}