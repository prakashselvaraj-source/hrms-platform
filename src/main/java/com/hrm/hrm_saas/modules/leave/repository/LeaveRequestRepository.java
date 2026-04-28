package com.hrm.hrm_saas.modules.leave.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @Query("""
                SELECT lr FROM LeaveRequest lr
                WHERE lr.employee.workEmail = :email
                AND lr.tenantId = :tenantId
                AND lr.startDate <= :endDate
                AND lr.endDate >= :startDate
            """)
    List<LeaveRequest> findLeavesInRange(
            @Param("email") String email,
            @Param("tenantId") String tenantId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
                SELECT lr.leavePolicy.id, COUNT(lr)
                FROM LeaveRequest lr
                WHERE lr.employee.workEmail = :email
                AND lr.tenantId = :tenantId
                AND lr.startDate <= :endDate
                AND lr.endDate >= :startDate
                GROUP BY lr.leavePolicy.id
            """)
    List<Object[]> getLeaveSummaryByEmail(
            @Param("email") String email,
            @Param("tenantId") String tenantId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<LeaveRequest> findByEmployee_WorkEmailAndTenantId(
            String email,
            String tenantId);

    List<LeaveRequest> findByEmployee_WorkEmailAndTenantIdAndStatus(
            String email,
            String tenantId,
            String status);

    List<LeaveRequest> findByEmployee_WorkEmailAndTenantIdAndStartDateBetween(
            String email,
            String tenantId,
            LocalDate startDate,
            LocalDate endDate);

    Page<LeaveRequest> findByTenantId(String tenantId, Pageable pageable);

    @Query("""
                SELECT 
                    COUNT(lr),
                    SUM(CASE WHEN lr.status = 'PENDING' THEN 1 ELSE 0 END),
                    SUM(CASE WHEN lr.status = 'APPROVED' THEN 1 ELSE 0 END),
                    SUM(CASE WHEN lr.status = 'REJECTED' THEN 1 ELSE 0 END)
                FROM LeaveRequest lr
                WHERE lr.tenantId = :tenantId
            """)
    List<Object[]> getLeaveStats(@Param("tenantId") String tenantId);

    Optional<LeaveRequest> findByTenantIdAndId(String tenantId, Long id);

    Long countByTenantIdAndStatusAndStartDateBetween(String tenantId, String status, LocalDate startDate,
            LocalDate endDate);
}