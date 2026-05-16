package com.hrm.hrm_saas.modules.overview.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.attendance.entity.Attendance;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeaveRequestResponseDto;
import com.hrm.hrm_saas.modules.overview.dto.DesignMemberResponse;
import com.hrm.hrm_saas.modules.overview.service.OverviewService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/overview")
@RequiredArgsConstructor
public class OverviewController {

    private final OverviewService overviewService;

    @GetMapping("/design-member")
    public List<DesignMemberResponse> getDesignMembers(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = request.getAttribute("email").toString();
        return overviewService.getDesignMembers(tenantId, email);
    }

    @GetMapping("/get-profile")
    public EmployeeDTO getProfile(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        String email = request.getAttribute("email").toString();
        return overviewService.getProfile(tenantId, email);
    }

    @GetMapping("/get-attendance")
    public List<Attendance> getAttendance(
            @RequestHeader("X-Tenant-Id") String tenantId, HttpServletRequest request) {

        String email = request.getAttribute("email").toString();

        return overviewService.getAttendance(tenantId, email);
    }

    @GetMapping("/get-leave-status")
    public ResponseEntity<List<LeaveRequestResponseDto>> getLeaveStats(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = request.getAttribute("email").toString();
        return ResponseEntity.ok(overviewService.getRequests(tenantId, email));
    }

    @GetMapping("/reporting-manager")
    public DesignMemberResponse getReportingManager(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {
        String email = request.getAttribute("email").toString();
        return overviewService.getReportingManager(tenantId, email);
    }

}
