package com.hrm.hrm_saas.modules.attendance.repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.attendance.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeIdAndDateAndTenantId(String employeeId, LocalDate date, String tenantId);
    Page<Attendance> findByTenantId(String tenantId, Pageable pageable);
    Page<Attendance> findByEmployeeIdAndTenantId(String employeeId, String tenantId, Pageable pageable);
    List<Attendance> findByEmployeeIdAndTenantId(String employeeId, String tenantId);
}
