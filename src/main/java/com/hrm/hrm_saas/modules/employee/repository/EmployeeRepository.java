package com.hrm.hrm_saas.modules.employee.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findByTenant(Tenant tenant,Pageable pageable);
    Optional<Employee> findByIdAndTenant(Long id, Tenant tenant);
    Page<Employee> findByStatusAndTenant(OnboardingStatus status, Tenant tenant,Pageable pageable);
    List<Employee> findByDepartmentAndTenant(String department, Tenant tenant);
    Optional<Employee> findByWorkEmailAndTenant(String workEmail, Tenant tenant);
    boolean existsByWorkEmailAndTenant(String workEmail, Tenant tenant);
    boolean existsByWorkEmail(String workEmail);
    Optional<Employee> findByWorkEmail(String workEmail);

    default Optional<Employee> findByIdAndTenantId(Long id, String tenantId) {
        return findByIdAndTenant_CompanyName(id, tenantId);
    }

    Optional<Employee> findByIdAndTenant_CompanyName(Long id, String companyName);

    boolean existsByWorkEmailAndTenant_CompanyName(String workEmail, String companyName);

    default boolean existsByWorkEmailAndTenantId(String workEmail, String tenantId) {
        return existsByWorkEmailAndTenant_CompanyName(workEmail, tenantId);
    }
}
