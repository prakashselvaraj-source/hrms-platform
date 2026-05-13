package com.hrm.hrm_saas.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {
    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private long pendingLeaveRequests;
    private long todayPresentCount;
    private long todayAbsentCount;
    private long openTickets;
    private List<Map<String, Object>> recentActivities;
    private List<Map<String, Object>> upcomingHolidays;
}
