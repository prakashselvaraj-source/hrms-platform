package com.hrm.hrm_saas.modules.employee.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.hrm_saas.common.service.EmailService;
import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import com.hrm.hrm_saas.modules.exception.DuplicateEmailException;
import com.hrm.hrm_saas.modules.exception.EmployeeNotFoundException;
import com.hrm.hrm_saas.modules.user.entity.User;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository repository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<EmployeeDTO> getAllEmployees(String tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id, String tenantId) {
        return repository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto, String tenantId) {
        if (dto.getWorkEmail() != null && repository.existsByWorkEmailAndTenantId(dto.getWorkEmail(), tenantId)) {
            throw new DuplicateEmailException("Email already in use for this tenant: " + dto.getWorkEmail());
        }
        Employee employee = toEntity(dto);
        employee.setTenantId(tenantId);

        String url = "http://localhost:3000/" + tenantId + "/employee/register?email=" + dto.getWorkEmail() + "&name="
                + dto.getFirstName() + " " + dto.getLastName();
        emailService.sendEmail(
                dto.getWorkEmail(),
                "Welcome to Our platform",
                "Register your account by set the password, link the following will redirect to the register page "
                        + url);

        return toDTO(repository.save(employee));

    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto, String tenantId) {
        Employee existing = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        // Check email uniqueness only if changed
        if (dto.getWorkEmail() != null
                && !dto.getWorkEmail().equals(existing.getWorkEmail())
                && repository.existsByWorkEmailAndTenantId(dto.getWorkEmail(), tenantId)) {
            throw new DuplicateEmailException("Email already in use for this tenant: " + dto.getWorkEmail());
        }

        updateEntityFromDTO(existing, dto);
        return toDTO(repository.save(existing));
    }

    public void deleteEmployee(Long id, String tenantId) {
        Employee existing = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        repository.delete(existing);
        // UserRepository.deleteByEmail()
    }

    public List<EmployeeDTO> getEmployeesByStatus(OnboardingStatus status, String tenantId) {
        return repository.findByStatusAndTenantId(status, tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Mapper: Entity → DTO ────────────────────────────────────────────────
    private EmployeeDTO toDTO(Employee e) {
        return EmployeeDTO.builder()
                .id(e.getId())
                .tenantId(e.getTenantId())
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
                .otherDocUrl(e.getOtherDocUrl())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    // ─── Mapper: DTO → Entity ────────────────────────────────────────────────
    private Employee toEntity(EmployeeDTO dto) {
        return Employee.builder()
                .tenantId(dto.getTenantId())
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
                .otherDocUrl(dto.getOtherDocUrl())
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
        if (dto.getOtherDocUrl() != null)
            e.setOtherDocUrl(dto.getOtherDocUrl());
        if (dto.getStatus() != null)
            e.setStatus(dto.getStatus());
    }
}
