package com.hrm.hrm_saas.modules.announcement.controller;

import com.hrm.hrm_saas.modules.announcement.model.AnnouncementDTO;
import com.hrm.hrm_saas.modules.announcement.service.AnnouncementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.hrm.hrm_saas.modules.announcement.model.AnnouncementPageResponse;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService service;

    @PostMapping
    public ResponseEntity<AnnouncementDTO> create(
            @Valid @RequestBody AnnouncementDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId) {

        AnnouncementDTO created = service.create(dto, tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<AnnouncementPageResponse> getAll(
            @RequestHeader("X-Tenant-Id") String tenantId,
            Pageable pageable) {
        return ResponseEntity.ok(service.getAll(tenantId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId) {

        return ResponseEntity.ok(service.getById(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId) {

        AnnouncementDTO updated = service.update(id, dto, tenantId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> delete(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        service.delete(id, tenantId);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Announcement deleted successfully");
        return ResponseEntity.ok(response);
    }
}