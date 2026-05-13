package com.hrm.hrm_saas.modules.designation.controller;

import com.hrm.hrm_saas.modules.designation.dto.DesignationDTO;
import com.hrm.hrm_saas.modules.designation.service.DesignationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
public class DesignationController {
    private final DesignationService designationService;

    @PostMapping
    public ResponseEntity<DesignationDTO> create(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody DesignationDTO dto) {
        return ResponseEntity.ok(designationService.create(tenantId, dto));
    }

    @GetMapping
    public ResponseEntity<List<DesignationDTO>> getAll(@RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(designationService.getAll(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignationDTO> getById(
            @PathVariable String id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(designationService.getById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesignationDTO> update(
            @PathVariable String id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody DesignationDTO dto) {
        return ResponseEntity.ok(designationService.update(id, tenantId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        designationService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
