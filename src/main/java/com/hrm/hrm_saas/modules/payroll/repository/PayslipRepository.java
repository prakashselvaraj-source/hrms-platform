package com.hrm.hrm_saas.modules.payroll.repository;

import com.hrm.hrm_saas.modules.payroll.entity.Payslip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, String> {
    @Query("SELECT p FROM Payslip p WHERE p.employee.id = :employeeId AND p.tenantId = :tenantId ORDER BY p.paymentDate DESC")
    Page<Payslip> findByEmployeeIdAndTenantIdOrderByPaymentDateDesc(@Param("employeeId") Long employeeId,
            @Param("tenantId") String tenantId, Pageable pageable);

    @Query("SELECT p FROM Payslip p WHERE p.employee.id = :employeeId AND p.tenantId = :tenantId")
    List<Payslip> findByEmployeeIdAndTenantId(@Param("employeeId") Long employeeId, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM Payslip p WHERE p.month = :month AND p.tenantId = :tenantId")
    List<Payslip> findByMonthAndTenantId(@Param("month") String month, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM Payslip p WHERE p.tenantId = :tenantId ORDER BY p.paymentDate DESC")
    Page<Payslip> findByTenantIdOrderByPaymentDateDesc(@Param("tenantId") String tenantId, Pageable pageable);

    List<Payslip> findByTenantId(String tenantId);
}
