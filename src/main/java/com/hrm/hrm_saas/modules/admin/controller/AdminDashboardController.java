package com.hrm.hrm_saas.modules.admin.controller;

import com.hrm.hrm_saas.modules.admin.dto.AdminDashboardStatsDTO;
import com.hrm.hrm_saas.modules.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getStats(@RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats(tenantId));
    }
}
