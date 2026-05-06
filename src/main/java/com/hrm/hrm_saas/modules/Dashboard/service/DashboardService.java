package com.hrm.hrm_saas.modules.Dashboard.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.announcement.service.AnnouncementService;
import com.hrm.hrm_saas.modules.leave.service.LeaveRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AnnouncementService announcementService;
    private final LeaveRequestService leaveRequestService;

    public Map<String, Object> getUserDashboard(String tenantId, String token) {

        System.out.println("tenantId" + tenantId);
        System.out.println("token" + token);

        int currentYear = LocalDate.now().getYear();

        Map<String, Object> response = new HashMap<>();

        // 🔹 Announcements
        response.put("announcements", announcementService.getAll(tenantId, org.springframework.data.domain.PageRequest.of(0, 10)).getAnnouncements());

        System.out.println("announcements" + response.get("announcements"));
        // 🔹 Leave Report
        com.hrm.hrm_saas.modules.leave.dto.LeaveDashboardResponse leaveData = leaveRequestService
                .getLeaveDashboard(tenantId, token, currentYear);

        response.put("leaveReport", leaveData.getSummary());

        System.out.println("report" + response);

        return response;
    }
}