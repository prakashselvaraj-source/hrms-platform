package com.hrm.hrm_saas.modules.resignation.controller;

import com.hrm.hrm_saas.modules.resignation.model.ResignationDTO;
import com.hrm.hrm_saas.modules.resignation.model.ResignationPageResponse;
import com.hrm.hrm_saas.modules.resignation.model.ResignationResponseDTO;
import com.hrm.hrm_saas.modules.resignation.service.ResignationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resignations")
@RequiredArgsConstructor
public class ResignationController {

    private final ResignationService resignationService;

    private boolean isTenantForbidden(String headerTenantId, HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        return tokenTenantId == null || !tokenTenantId.equals(headerTenantId);
    }

    @PostMapping
    public ResponseEntity<ResignationDTO> create(
            @Valid @RequestBody ResignationDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = (String) request.getAttribute("email");
        dto.setTenantId(tenantId);
        ResignationDTO created = resignationService.create(dto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<ResignationPageResponse> getAll(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request,
            Pageable pageable) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ResignationPageResponse resignations = resignationService.getAllForTenant(tenantId, pageable);
        return ResponseEntity.ok(resignations);
    }

    @GetMapping("/me")
    public ResponseEntity<ResignationPageResponse> getMyResignations(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request,
            Pageable pageable) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = (String) request.getAttribute("email");
        ResignationPageResponse resignations = resignationService.getByEmployeeEmail(email, tenantId, pageable);
        return ResponseEntity.ok(resignations);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ResignationPageResponse> getByEmployee(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request,
            Pageable pageable) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ResignationPageResponse resignations = resignationService.getByEmployeeId(employeeId, tenantId, pageable);
        return ResponseEntity.ok(resignations);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResignationDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String status = body.get("status");
        ResignationDTO updated = resignationService.updateStatus(id, status, tenantId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> delete(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        resignationService.delete(id);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Resignation deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResignationResponseDTO> getById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ResignationResponseDTO resignation = resignationService.getById(id, tenantId);
        return ResponseEntity.ok(resignation);
    }
}
