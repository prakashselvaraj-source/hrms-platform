package com.hrm.hrm_saas.modules.employee.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findByTenant(Tenant tenant, Pageable pageable);

    Optional<Employee> findByIdAndTenant(Long id, Tenant tenant);

    @Query("SELECT e FROM Employee e WHERE e.tenant = :tenant " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:deptName IS NULL OR (LOWER(e.department) = LOWER(:deptName) OR LOWER(e.department) = LOWER(:deptCode))) " +
           "AND (:search IS NULL OR (" +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.workEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(e.id AS string) LIKE CONCAT('%', :search, '%')))")
    Page<Employee> findWithFilters(
            @Param("tenant") Tenant tenant,
            @Param("status") OnboardingStatus status,
            @Param("deptName") String deptName,
            @Param("deptCode") String deptCode,
            @Param("search") String search,
            Pageable pageable);

    Page<Employee> findByStatusAndTenant(OnboardingStatus status, Tenant tenant, Pageable pageable);

    List<Employee> findByDepartmentAndTenant(String department, Tenant tenant);

    Optional<Employee> findByWorkEmailAndTenant(String workEmail, Tenant tenant);

    boolean existsByWorkEmailAndTenant(String workEmail, Tenant tenant);

    boolean existsByWorkEmail(String workEmail);

    Optional<Employee> findByWorkEmail(String workEmail);

    Optional<Employee> findByWorkEmailIgnoreCase(String workEmail);

    default Optional<Employee> findByIdAndTenantId(Long id, String tenantId) {
        return findByIdAndTenant_CompanyName(id, tenantId);
    }

    Optional<Employee> findByIdAndTenant_CompanyName(Long id, String companyName);

    boolean existsByWorkEmailAndTenant_CompanyName(String workEmail, String companyName);

    default boolean existsByWorkEmailAndTenantId(String workEmail, String tenantId) {
        return existsByWorkEmailAndTenant_CompanyName(workEmail, tenantId);
    }

    // overview
    List<Employee> findByTenant_CompanyNameAndDepartmentIgnoreCase(String companyName,
            String department);

    Employee findByTenant_CompanyNameAndWorkEmail(String companyName, String workEmail);

    Employee findByTenant_CompanyNameIgnoreCaseAndWorkEmailIgnoreCase(String companyName, String workEmail);

    Employee findByTenant_CompanyCodeIgnoreCaseAndWorkEmailIgnoreCase(String companyCode, String workEmail);

    long countByTenant_CompanyName(String companyName);

}
