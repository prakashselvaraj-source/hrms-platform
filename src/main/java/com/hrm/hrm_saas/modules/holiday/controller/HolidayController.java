package com.hrm.hrm_saas.modules.holiday.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.holiday.model.HolidayDTO;
import com.hrm.hrm_saas.modules.holiday.model.HolidayPageResponse;
import com.hrm.hrm_saas.modules.holiday.service.HolidayService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService service;

    @PostMapping
    public ResponseEntity<HolidayDTO> createHoliday(
            @Valid @RequestBody HolidayDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(service.createHoliday(dto, tenantId));
    }

    @GetMapping
    public ResponseEntity<HolidayPageResponse> getAllHolidays(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(service.getAllHolidays(tenantId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HolidayDTO> getHolidayById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(service.getHolidayById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HolidayDTO> updateHoliday(
            @PathVariable Long id,
            @Valid @RequestBody HolidayDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(service.updateHoliday(id, dto, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoliday(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        service.deleteHoliday(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}