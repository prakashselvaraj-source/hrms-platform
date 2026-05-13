package com.hrm.hrm_saas.modules.promotion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.promotion.model.PromotionDTO;
import com.hrm.hrm_saas.modules.promotion.service.PromotionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    private boolean isTenantForbidden(String headerTenantId, HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        return tokenTenantId == null || !tokenTenantId.equals(headerTenantId);
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> create(
            @Valid @RequestBody PromotionDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        dto.setTenantId(tenantId);
        PromotionDTO created = promotionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAll(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<PromotionDTO> promotions = promotionService.getAll(tenantId);
        return ResponseEntity.ok(promotions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionDTO> getById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PromotionDTO promotion = promotionService.getById(id);
        return ResponseEntity.ok(promotion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody PromotionDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        dto.setTenantId(tenantId);
        PromotionDTO updated = promotionService.update(id, dto);
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

        promotionService.delete(id);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Promotion deleted successfully");
        return ResponseEntity.ok(response);
    }
}