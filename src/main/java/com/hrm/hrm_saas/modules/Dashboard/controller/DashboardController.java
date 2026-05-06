package com.hrm.hrm_saas.modules.Dashboard.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.Dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/user")
    public Map<String, Object> getUserDashboard(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token) {
        return dashboardService.getUserDashboard(tenantId, token);
    }

}
