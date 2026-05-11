package com.hrm.hrm_saas.modules.leave.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrm.hrm_saas.modules.employee.model.Employee;
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

    Page<LeaveRequest> findByTenantIdAndEmployee(String tenantId, Employee employee, Pageable pageable);

    Long countByTenantIdAndStatusAndStartDateBetween(String tenantId, String status, LocalDate startDate,
            LocalDate endDate);

    @Query(value = "SELECT COALESCE(SUM(DATEDIFF(lr.end_date, lr.start_date) + 1), 0) " +
            "FROM leave_requests lr " +
            "WHERE lr.employee_id = :employeeId " +
            "AND lr.leave_policy_id = :policyId " +
            "AND lr.status != 'REJECTED' " +
            "AND lr.year = :year", nativeQuery = true)
    Long countDaysByEmployeeAndPolicyAndYear(
            @Param("employeeId") Long employeeId,
            @Param("policyId") String policyId,
            @Param("year") int year);

    @Query("""
                SELECT lr FROM LeaveRequest lr
                WHERE lr.employee.id = :employeeId
                AND lr.leavePolicy.id = :policyId
                AND lr.tenantId = :tenantId
                AND lr.status != 'REJECTED'
                AND lr.startDate <= :endDate
                AND lr.endDate >= :startDate
            """)
    List<LeaveRequest> findLeavesInRange(
            @Param("employeeId") Long employeeId,
            @Param("policyId") String policyId,
            @Param("tenantId") String tenantId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<LeaveRequest> findByTenantIdAndEmployee_WorkEmailOrderByStartDateDesc(String tenantId, String email);
}