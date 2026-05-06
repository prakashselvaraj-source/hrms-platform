package com.hrm.hrm_saas.modules.attendance.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.attendance.entity.Attendance;
import com.hrm.hrm_saas.modules.attendance.entity.AttendanceLog;
import com.hrm.hrm_saas.modules.attendance.enums.AttendanceStatus;
import com.hrm.hrm_saas.modules.attendance.enums.LogType;
import com.hrm.hrm_saas.modules.attendance.repository.AttendanceLogRepository;
import com.hrm.hrm_saas.modules.attendance.repository.AttendanceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repository;
    private final AttendanceLogRepository logRepository;

    public Attendance checkIn(String employeeId, String tenantId) {

        LocalDate today = LocalDate.now();

        repository.findByEmployeeIdAndDateAndTenantId(employeeId, today, tenantId).ifPresent(a -> {
            throw new RuntimeException("Already checked in for today");
        });

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(today);
        attendance.setTenantId(tenantId);
        attendance.setCheckIn(LocalDateTime.now());

        LocalTime officeStart = LocalTime.of(9, 30);
        if (LocalTime.now().isAfter(officeStart)) {
            attendance.setLate(true);
        }

        repository.save(attendance);

        AttendanceLog log = new AttendanceLog();
        log.setEmployeeId(employeeId);
        log.setTenantId(tenantId);
        log.setTimestamp(LocalDateTime.now());
        log.setType(LogType.CHECK_IN);

        logRepository.save(log);

        return attendance;
    }

    public Attendance checkOut(String employeeId, String tenantId) {

        LocalDate today = LocalDate.now();

        Attendance attendance = repository.findByEmployeeIdAndDateAndTenantId(employeeId, today, tenantId)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Already checked out for today");
        }

        LocalDateTime checkOutTime = LocalDateTime.now();

        attendance.setCheckOut(checkOutTime);

        Duration duration = Duration.between(attendance.getCheckIn(), checkOutTime);
        double hours = duration.toMinutes() / 60.0;

        attendance.setTotalHours(hours);

        if (hours >= 8) {
            attendance.setStatus(AttendanceStatus.FULL_DAY);
        } else if (hours >= 4) {
            attendance.setStatus(AttendanceStatus.HALF_DAY);
        } else {
            attendance.setStatus(AttendanceStatus.ABSENT);
        }

        repository.save(attendance);

        AttendanceLog log = new AttendanceLog();
        log.setEmployeeId(employeeId);
        log.setTenantId(tenantId);
        log.setTimestamp(LocalDateTime.now());
        log.setType(LogType.CHECK_OUT);

        logRepository.save(log);

        return attendance;
    }

    public Page<Attendance> getAll(String tenantId, Pageable pageable) {
        return repository.findByTenantId(tenantId, pageable);
    }

    public Page<Attendance> getEmployeeAttendance(String employeeId, String tenantId, Pageable pageable) {
        return repository.findByEmployeeIdAndTenantId(employeeId, tenantId, pageable);
    }

    public Map<String, Long> getStats(String employeeId, String tenantId) {
        List<Attendance> list = repository.findByEmployeeIdAndTenantId(employeeId, tenantId);

        Map<String, Long> stats = new HashMap<>();
        stats.put("present", list.stream().filter(a -> a.getStatus() == AttendanceStatus.FULL_DAY).count());
        stats.put("absent", list.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count());
        stats.put("halfDay", list.stream().filter(a -> a.getStatus() == AttendanceStatus.HALF_DAY).count());
        stats.put("late", list.stream().filter(Attendance::isLate).count());

        return stats;
    }
}
