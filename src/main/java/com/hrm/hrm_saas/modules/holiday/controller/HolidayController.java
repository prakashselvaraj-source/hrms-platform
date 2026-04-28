package com.hrm.hrm_saas.modules.holiday.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

import com.hrm.hrm_saas.modules.holiday.model.HolidayDTO;
import com.hrm.hrm_saas.modules.holiday.model.Holiday;
import com.hrm.hrm_saas.modules.holiday.service.HolidayService;

import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/holidays")
@CrossOrigin
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService service;

    @PostMapping
    public ResponseEntity<Holiday> createHoliday(
            @Valid @RequestBody HolidayDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.createHoliday(dto, tenantId));
    }

    @GetMapping
    public ResponseEntity<List<Holiday>> getAllHolidays(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");

        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.getAllHolidays(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Holiday> getHolidayById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.getHolidayById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Holiday> updateHoliday(
            @PathVariable Long id,
            @Valid @RequestBody HolidayDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.updateHoliday(id, dto, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHoliday(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String tokenTenantId = (String) request.getAttribute("tenantId");
        if (tokenTenantId == null || !tokenTenantId.equals(tenantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        service.deleteHoliday(id, tenantId);
        return ResponseEntity.ok("Deleted successfully");
    }
}