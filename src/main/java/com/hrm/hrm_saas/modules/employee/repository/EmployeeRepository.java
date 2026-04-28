package com.hrm.hrm_saas.modules.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByTenantId(String tenantId);

    Optional<Employee> findByIdAndTenantId(Long id, String tenantId);

    List<Employee> findByStatusAndTenantId(OnboardingStatus status, String tenantId);

    List<Employee> findByDepartmentAndTenantId(String department, String tenantId);

    Optional<Employee> findByWorkEmailAndTenantId(String workEmail, String tenantId);

    boolean existsByWorkEmailAndTenantId(String workEmail, String tenantId);

    boolean existsByWorkEmail(String workEmail);

    Optional<Employee> findByWorkEmail(String workEmail);

}
