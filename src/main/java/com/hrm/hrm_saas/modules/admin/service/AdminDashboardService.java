package com.hrm.hrm_saas.modules.admin.service;

import com.hrm.hrm_saas.modules.admin.dto.AdminDashboardStatsDTO;
import com.hrm.hrm_saas.modules.attendance.repository.AttendanceRepository;
import com.hrm.hrm_saas.modules.department.repository.DepartmentRepository;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.holiday.repository.HolidayRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveRequestRepository;
import com.hrm.hrm_saas.modules.ticket.repository.TicketRepository;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AttendanceRepository attendanceRepository;
    private final TicketRepository ticketRepository;
    private final HolidayRepository holidayRepository;

    public AdminDashboardStatsDTO getDashboardStats(String tenantId) {
        LocalDate today = LocalDate.now();

        // Basic Counts
        long totalEmployees = employeeRepository.countByTenant_CompanyName(tenantId);
        long totalDepartments = departmentRepository.countByTenantId(tenantId);
        long openTickets = ticketRepository.countByTenantIdAndStatus(tenantId, com.hrm.hrm_saas.modules.ticket.model.TicketStatus.OPEN);
        
        // Leave Stats
        List<Object[]> leaveStats = leaveRequestRepository.getLeaveStats(tenantId);
        long pendingLeaves = 0;
        if (leaveStats != null && !leaveStats.isEmpty()) {
            Object[] stats = leaveStats.get(0);
            pendingLeaves = stats[1] != null ? ((Number) stats[1]).longValue() : 0;
        }

        // Attendance Stats (Simplified)
        // In a real app, this would involve complex queries
        long todayPresent = 0; // attendanceRepository.countByTenantIdAndDate(tenantId, today);

        // Upcoming Holidays
        List<Map<String, Object>> upcomingHolidays = new ArrayList<>();
        holidayRepository.findByTenantCompanyName(tenantId, org.springframework.data.domain.PageRequest.of(0, 5))
                .getContent().forEach(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", h.getHolidayName());
                    map.put("date", h.getDate());
                    upcomingHolidays.add(map);
                });

        return AdminDashboardStatsDTO.builder()
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .pendingLeaveRequests(pendingLeaves)
                .todayPresentCount(todayPresent)
                .todayAbsentCount(totalEmployees - todayPresent)
                .openTickets(openTickets)
                .upcomingHolidays(upcomingHolidays)
                .recentActivities(new ArrayList<>()) // Placeholder
                .build();
    }
}
