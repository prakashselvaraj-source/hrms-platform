package com.hrm.hrm_saas.modules.employee.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hrm.hrm_saas.common.service.EmailService;
import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import com.hrm.hrm_saas.modules.exception.DuplicateEmailException;
import com.hrm.hrm_saas.modules.exception.EmployeeNotFoundException;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.enums.UserRole;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.role.model.Role;
import com.hrm.hrm_saas.modules.role.repository.RoleRepository;
import com.hrm.hrm_saas.modules.exception.TenantNotFoundException;
import com.hrm.hrm_saas.modules.exception.RoleNotFoundException;
import com.hrm.hrm_saas.modules.department.entity.Department;
import com.hrm.hrm_saas.modules.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;

import com.hrm.hrm_saas.modules.employee.model.EmployeePageResponse;
import com.hrm.hrm_saas.modules.employee.model.EmployeeProfileDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository repository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TenantRepository tenantRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    private Tenant getTenant(String companyName) {
        return tenantRepository.findByCompanyName(companyName)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found with code: " + companyName));
    }

    public EmployeePageResponse getAllEmployees(String tenantId, OnboardingStatus status, String departmentId,
            String search, Pageable pageable) {
        System.out.println("DEBUG: getAllEmployees - tenantId=" + tenantId + ", status=" + status + ", departmentId="
                + departmentId + ", search=" + search);

        Tenant tenant = getTenant(tenantId);
        String departmentName = null;
        String departmentCode = null;

        // Clean up empty strings
        if (departmentId != null && departmentId.trim().isEmpty())
            departmentId = null;
        if (search != null && search.trim().isEmpty())
            search = null;

        if (departmentId != null) {
            Department dept = departmentRepository.findById(departmentId).orElse(null);
            if (dept == null) {
                System.out.println("DEBUG: Department not found for id: " + departmentId);
                return new EmployeePageResponse(java.util.Collections.emptyList(), 0, 0, 0);
            }
            departmentName = dept.getName();
            departmentCode = dept.getCode();
        }

        org.springframework.data.domain.Page<Employee> page = repository.findWithFilters(
                tenant, status, departmentName, departmentCode, search, pageable);

        List<EmployeeDTO> employees = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new EmployeePageResponse(employees, page.getNumber(), page.getTotalPages(), page.getTotalElements());
    }

    public EmployeeDTO getEmployeeById(Long id, String tenantId) {
        Tenant tenant = getTenant(tenantId);
        return repository.findByIdAndTenant(id, tenant)
                .map(this::toDTO)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto, String tenantId) {

        Tenant tenant = getTenant(tenantId);

        if (dto.getWorkEmail() != null &&
                repository.existsByWorkEmailAndTenant(dto.getWorkEmail(), tenant)) {

            throw new DuplicateEmailException(
                    "Email already in use for this tenant: " + dto.getWorkEmail());
        }

        Role role = roleRepository
                .findFirstByNameAndTenantId(dto.getRole(), tenant.getCompanyName())
                .orElseThrow(() -> new RoleNotFoundException(
                        "Role not found with name: " + dto.getRole()));

        Employee employee = toEntity(dto);

        employee.setTenant(tenant);
        employee.setRole(role);

        Employee savedEmployee = repository.save(employee);

        // CREATE USER ACCOUNT
        User user = new User();

        user.setEmail(dto.getWorkEmail());
        user.setName(dto.getFirstName() + " " + dto.getLastName());

        // temporary password
        user.setPassword(passwordEncoder.encode("Temp@123"));

        user.setTenant(tenant);

        // IMPORTANT
        user.setRole(UserRole.EMPLOYEE);

        userRepository.save(user);

        String url = "http://localhost:3000/"
                + tenantId
                + "/employee/register?email="
                + dto.getWorkEmail()
                + "&name="
                + dto.getFirstName()
                + " "
                + dto.getLastName();

        emailService.sendEmail(
                dto.getWorkEmail(),
                "Welcome to Our platform",
                "Register your account by set the password, link the following will redirect to the register page "
                        + url);

        return toDTO(savedEmployee);
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto, String tenantId) {
        Tenant tenant = getTenant(tenantId);
        Employee existing = repository.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        // Check email uniqueness only if changed
        if (dto.getWorkEmail() != null
                && !dto.getWorkEmail().equals(existing.getWorkEmail())
                && repository.existsByWorkEmailAndTenant(dto.getWorkEmail(), tenant)) {
            throw new DuplicateEmailException("Email already in use for this tenant: " + dto.getWorkEmail());
        }

        if (dto.getRole() != null) {
            Role role = roleRepository.findFirstByNameAndTenantId(dto.getRole(), tenant.getCompanyName())
                    .orElseThrow(() -> new RoleNotFoundException("Role not found with name: " + dto.getRole()));
            existing.setRole(role);
        }

        updateEntityFromDTO(existing, dto);
        return toDTO(repository.save(existing));
    }

    public void deleteEmployee(Long id, String tenantId) {
        Tenant tenant = getTenant(tenantId);
        Employee existing = repository.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        repository.delete(existing);
    }

    public EmployeeProfileDTO getEmployeeProfile(String mail, String tenantId) {
        Tenant tenant = getTenant(tenantId);
        return repository.findFirstByWorkEmailAndTenant(mail, tenant)
                .map(this::toProfileDTO)
                .orElseThrow(() -> new EmployeeNotFoundException("There No such user with this mail: " + mail));
    }

    // ─── Mapper: Entity → DTO ────────────────────────────────────────────────
    private EmployeeDTO toDTO(Employee e) {
        return EmployeeDTO.builder()
                .id(e.getId())
                .tenantId(e.getTenant() != null ? e.getTenant().getCompanyName() : null)
                .roleId(e.getRole() != null ? e.getRole().getId() : null)
                .role(e.getRole() != null ? e.getRole().getName() : null)
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .dateOfBirth(e.getDateOfBirth())
                .gender(e.getGender())
                .workEmail(e.getWorkEmail())
                .mobileNumber(e.getMobileNumber())
                .department(e.getDepartment())
                .designation(e.getDesignation())
                .photoUrl(e.getPhotoUrl())
                .currentStreet(e.getCurrentStreet())
                .currentCity(e.getCurrentCity())
                .currentState(e.getCurrentState())
                .currentZip(e.getCurrentZip())
                .currentCountry(e.getCurrentCountry())
                .permanentStreet(e.getPermanentStreet())
                .permanentCity(e.getPermanentCity())
                .permanentState(e.getPermanentState())
                .emergencyContactName(e.getEmergencyContactName())
                .emergencyContactRelationship(e.getEmergencyContactRelationship())
                .emergencyContactMobile(e.getEmergencyContactMobile())
                .dateOfJoining(e.getDateOfJoining())
                .reportingManager(e.getReportingManager())
                .workLocation(e.getWorkLocation())
                .employmentType(e.getEmploymentType())
                .accountHolderName(e.getAccountHolderName())
                .bankName(e.getBankName())
                .branchName(e.getBranchName())
                .accountNumber(e.getAccountNumber())
                .ifscSwiftCode(e.getIfscSwiftCode())
                .aadharNumber(e.getAadharNumber())
                .panNumber(e.getPanNumber())
                .disbursementMethod(e.getDisbursementMethod())
                .annualCtc(e.getAnnualCtc())
                .monthlyGross(e.getMonthlyGross())
                .basicSalary(e.getBasicSalary())
                .performanceBonus(e.getPerformanceBonus())
                .professionalTax(e.getProfessionalTax())
                .identityProofUrl(e.getIdentityProofUrl())
                .educationCertUrl(e.getEducationCertUrl())
                .employmentProofUrl(e.getEmploymentProofUrl())
                .otherDocUrls(e.getOtherDocUrls())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    // ─── Mapper: DTO → Entity ────────────────────────────────────────────────
    private Employee toEntity(EmployeeDTO dto) {
        return Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .workEmail(dto.getWorkEmail())
                .mobileNumber(dto.getMobileNumber())
                .department(dto.getDepartment())
                .designation(dto.getDesignation())
                .photoUrl(dto.getPhotoUrl())
                .currentStreet(dto.getCurrentStreet())
                .currentCity(dto.getCurrentCity())
                .currentState(dto.getCurrentState())
                .currentZip(dto.getCurrentZip())
                .currentCountry(dto.getCurrentCountry())
                .permanentStreet(dto.getPermanentStreet())
                .permanentCity(dto.getPermanentCity())
                .permanentState(dto.getPermanentState())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactRelationship(dto.getEmergencyContactRelationship())
                .emergencyContactMobile(dto.getEmergencyContactMobile())
                .dateOfJoining(dto.getDateOfJoining())
                .reportingManager(dto.getReportingManager())
                .workLocation(dto.getWorkLocation())
                .employmentType(dto.getEmploymentType())
                .accountHolderName(dto.getAccountHolderName())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .accountNumber(dto.getAccountNumber())
                .ifscSwiftCode(dto.getIfscSwiftCode())
                .aadharNumber(dto.getAadharNumber())
                .panNumber(dto.getPanNumber())
                .disbursementMethod(dto.getDisbursementMethod())
                .annualCtc(dto.getAnnualCtc())
                .monthlyGross(dto.getMonthlyGross())
                .basicSalary(dto.getBasicSalary())
                .performanceBonus(dto.getPerformanceBonus())
                .professionalTax(dto.getProfessionalTax())
                .identityProofUrl(dto.getIdentityProofUrl())
                .educationCertUrl(dto.getEducationCertUrl())
                .employmentProofUrl(dto.getEmploymentProofUrl())
                .otherDocUrls(dto.getOtherDocUrls())
                .status(dto.getStatus())
                .build();
    }

    private void updateEntityFromDTO(Employee e, EmployeeDTO dto) {
        if (dto.getFirstName() != null)
            e.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)
            e.setLastName(dto.getLastName());
        if (dto.getDateOfBirth() != null)
            e.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null)
            e.setGender(dto.getGender());
        if (dto.getWorkEmail() != null)
            e.setWorkEmail(dto.getWorkEmail());
        if (dto.getMobileNumber() != null)
            e.setMobileNumber(dto.getMobileNumber());
        if (dto.getDepartment() != null)
            e.setDepartment(dto.getDepartment());
        if (dto.getDesignation() != null)
            e.setDesignation(dto.getDesignation());
        if (dto.getPhotoUrl() != null)
            e.setPhotoUrl(dto.getPhotoUrl());
        if (dto.getCurrentStreet() != null)
            e.setCurrentStreet(dto.getCurrentStreet());
        if (dto.getCurrentCity() != null)
            e.setCurrentCity(dto.getCurrentCity());
        if (dto.getCurrentState() != null)
            e.setCurrentState(dto.getCurrentState());
        if (dto.getCurrentZip() != null)
            e.setCurrentZip(dto.getCurrentZip());
        if (dto.getCurrentCountry() != null)
            e.setCurrentCountry(dto.getCurrentCountry());
        if (dto.getPermanentStreet() != null)
            e.setPermanentStreet(dto.getPermanentStreet());
        if (dto.getPermanentCity() != null)
            e.setPermanentCity(dto.getPermanentCity());
        if (dto.getPermanentState() != null)
            e.setPermanentState(dto.getPermanentState());
        if (dto.getEmergencyContactName() != null)
            e.setEmergencyContactName(dto.getEmergencyContactName());
        if (dto.getEmergencyContactRelationship() != null)
            e.setEmergencyContactRelationship(dto.getEmergencyContactRelationship());
        if (dto.getEmergencyContactMobile() != null)
            e.setEmergencyContactMobile(dto.getEmergencyContactMobile());
        if (dto.getDateOfJoining() != null)
            e.setDateOfJoining(dto.getDateOfJoining());
        if (dto.getReportingManager() != null)
            e.setReportingManager(dto.getReportingManager());
        if (dto.getWorkLocation() != null)
            e.setWorkLocation(dto.getWorkLocation());
        if (dto.getEmploymentType() != null)
            e.setEmploymentType(dto.getEmploymentType());
        if (dto.getAccountHolderName() != null)
            e.setAccountHolderName(dto.getAccountHolderName());
        if (dto.getBankName() != null)
            e.setBankName(dto.getBankName());
        if (dto.getBranchName() != null)
            e.setBranchName(dto.getBranchName());
        if (dto.getAccountNumber() != null)
            e.setAccountNumber(dto.getAccountNumber());
        if (dto.getIfscSwiftCode() != null)
            e.setIfscSwiftCode(dto.getIfscSwiftCode());
        if (dto.getAadharNumber() != null)
            e.setAadharNumber(dto.getAadharNumber());
        if (dto.getPanNumber() != null)
            e.setPanNumber(dto.getPanNumber());
        if (dto.getDisbursementMethod() != null)
            e.setDisbursementMethod(dto.getDisbursementMethod());
        if (dto.getAnnualCtc() != null)
            e.setAnnualCtc(dto.getAnnualCtc());
        if (dto.getMonthlyGross() != null)
            e.setMonthlyGross(dto.getMonthlyGross());
        if (dto.getBasicSalary() != null)
            e.setBasicSalary(dto.getBasicSalary());
        if (dto.getPerformanceBonus() != null)
            e.setPerformanceBonus(dto.getPerformanceBonus());
        if (dto.getProfessionalTax() != null)
            e.setProfessionalTax(dto.getProfessionalTax());
        if (dto.getIdentityProofUrl() != null)
            e.setIdentityProofUrl(dto.getIdentityProofUrl());
        if (dto.getEducationCertUrl() != null)
            e.setEducationCertUrl(dto.getEducationCertUrl());
        if (dto.getEmploymentProofUrl() != null)
            e.setEmploymentProofUrl(dto.getEmploymentProofUrl());
        if (dto.getOtherDocUrls() != null)
            e.setOtherDocUrls(dto.getOtherDocUrls());
        if (dto.getStatus() != null)
            e.setStatus(dto.getStatus());
    }

    private EmployeeProfileDTO toProfileDTO(Employee e) {
        return EmployeeProfileDTO.builder()
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .workEmail(e.getWorkEmail())
                .dateOfBirth(e.getDateOfBirth())
                .mobileNumber(e.getMobileNumber())
                .gender(e.getGender())
                .currentStreet(e.getCurrentStreet())
                .currentCity(e.getCurrentCity())
                .currentState(e.getCurrentState())
                .currentZip(e.getCurrentZip())
                .currentCountry(e.getCurrentCountry())
                .designation(e.getDesignation())
                .department(e.getDepartment())
                .dateOfJoining(e.getDateOfJoining())
                .photoUrl(e.getPhotoUrl())
                .identityProofUrl(e.getIdentityProofUrl())
                .educationCertUrl(e.getEducationCertUrl())
                .employmentProofUrl(e.getEmploymentProofUrl())
                .otherDocUrls(e.getOtherDocUrls())
                .build();
    }
}
