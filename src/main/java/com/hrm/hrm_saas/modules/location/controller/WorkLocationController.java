package com.hrm.hrm_saas.modules.location.controller;

import com.hrm.hrm_saas.modules.location.dto.WorkLocationDTO;
import com.hrm.hrm_saas.modules.location.service.WorkLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class WorkLocationController {
    private final WorkLocationService workLocationService;

    @PostMapping
    public ResponseEntity<WorkLocationDTO> create(
            HttpServletRequest request,
            @RequestBody WorkLocationDTO dto) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(workLocationService.create(tenantId, dto));
    }

    @GetMapping
    public ResponseEntity<List<WorkLocationDTO>> getAll(HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(workLocationService.getAll(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkLocationDTO> getById(
            @PathVariable String id,
            HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(workLocationService.getById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkLocationDTO> update(
            @PathVariable String id,
            HttpServletRequest request,
            @RequestBody WorkLocationDTO dto) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(workLocationService.update(id, tenantId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        workLocationService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
