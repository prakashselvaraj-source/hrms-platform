package com.hrm.hrm_saas.modules.shift.controller;

import com.hrm.hrm_saas.modules.shift.dto.ShiftDTO;
import com.hrm.hrm_saas.modules.shift.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

    @PostMapping
    public ResponseEntity<ShiftDTO> create(
            HttpServletRequest request,
            @RequestBody ShiftDTO dto) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(shiftService.create(tenantId, dto));
    }

    @GetMapping
    public ResponseEntity<List<ShiftDTO>> getAll(HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(shiftService.getAll(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftDTO> getById(
            @PathVariable String id,
            HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(shiftService.getById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShiftDTO> update(
            @PathVariable String id,
            HttpServletRequest request,
            @RequestBody ShiftDTO dto) {
        String tenantId = (String) request.getAttribute("tenantId");
        return ResponseEntity.ok(shiftService.update(id, tenantId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        shiftService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
