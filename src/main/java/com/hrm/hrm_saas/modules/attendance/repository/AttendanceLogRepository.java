package com.hrm.hrm_saas.modules.attendance.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.attendance.entity.AttendanceLog;

public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {

    List<AttendanceLog> findByEmployeeIdAndTenantIdAndTimestampBetween(String employeeId, String tenantId,
            LocalDateTime start, LocalDateTime end);

    List<AttendanceLog> findByTenantIdAndTimestampBetween(String tenantId, LocalDateTime start, LocalDateTime end);
}
