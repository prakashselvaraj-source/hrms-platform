package com.hrm.hrm_saas.modules.user.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.tenant.dto.TenantResponseDTO;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.user.dto.CreateUserRequest;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.enums.UserRole;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import com.hrm.hrm_saas.modules.user.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final TenantRepository tenantRepository;
        private final EmployeeRepository employeeRepository;

        public TenantResponseDTO getTenantByEmail(String email) {
                User user = userRepository.findFirstByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return new TenantResponseDTO(
                                user.getTenant().getId(),
                                user.getTenant().getCompanyName(),
                                user.getTenant().getCompanyCode());
        }

        public CreateUserRequest createUser(CreateUserRequest dto) {
                Optional<User> user = userRepository.findFirstByEmail(dto.getEmail());
                if (user.isPresent()) {
                        throw new RuntimeException("User Already exists");
                }

                Tenant tenant = tenantRepository.findByCompanyCode(dto.getTenant())
                                .or(() -> tenantRepository.findByCompanyName(dto.getTenant()))
                                .orElseThrow(() -> new RuntimeException("Tenant not found"));

                User userdata = User.builder()
                                .name(dto.getUsername())
                                .role(UserRole.EMPLOYEE)
                                .email(dto.getEmail())
                                .tenant(tenant)
                                .password(passwordEncoder.encode(dto.getPassword()))
                                .build();
                userRepository.save(userdata);

                return CreateUserRequest.builder()
                                .email(userdata.getEmail())
                                .role(userdata.getRole())
                                .build();
        }

        @Transactional
        public void updateLastSeen(String email) {
                System.out.println("Updating last seen for: " + email);
                userRepository.findFirstByEmailIgnoreCase(email).ifPresent(user -> {
                        LocalDateTime now = LocalDateTime.now();
                        System.out.println("Current lastSeen: " + user.getLastSeen() + ", Now: " + now);
                        if (user.getLastSeen() == null || user.getLastSeen().isBefore(now.minusMinutes(1))) {
                                System.out.println("Updating lastSeen to: " + now);
                                user.setLastSeen(now);
                                user.setIsOnline(true);
                                userRepository.save(user);
                        }
                });
        }

        public UserResponse findByEmail(String email) {

                System.out.println("Email from user side: " + email);
                User user = userRepository.findFirstByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                System.out.println("User from User Service: " + UserRole.ADMIN.equals(user.getRole()));
                if (UserRole.ADMIN.equals(user.getRole())) {
                        String name = user.getName() != null ? user.getName() : "";
                        String[] nameParts = name.split(" ");
                        String firstName = nameParts[0];
                        String lastName = nameParts.length > 1 ? nameParts[1] : "";

                        return UserResponse.builder()
                                        .id(user.getId())
                                        .username(user.getName())
                                        .firstName(firstName)
                                        .lastName(lastName)
                                        .email(user.getEmail())
                                        .role(user.getRole().name())
                                        .build();
                }

                Employee employee = employeeRepository.findFirstByWorkEmail(user.getEmail())
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
                System.out.println("id: " + employee.getId());
                System.out.println("firstName: " + employee.getFirstName());
                System.out.println("lastName: " + employee.getLastName());
                System.out.println("email: " + employee.getWorkEmail());

                return UserResponse.builder()
                                .id(employee.getId())
                                .username(user.getName())
                                .firstName(employee.getFirstName())
                                .lastName(employee.getLastName())
                                .email(employee.getWorkEmail())
                                .role("USER")
                                .employee(mapToDTO(employee))
                                .build();
        }

        private EmployeeDTO mapToDTO(Employee employee) {
                return EmployeeDTO.builder()
                                .id(employee.getId())
                                .tenantId(employee.getTenant().getCompanyName())
                                .roleId(employee.getRole().getId())
                                .firstName(employee.getFirstName())
                                .lastName(employee.getLastName())
                                .dateOfBirth(employee.getDateOfBirth())
                                .gender(employee.getGender())
                                .workEmail(employee.getWorkEmail())
                                .mobileNumber(employee.getMobileNumber())
                                .photoUrl(employee.getPhotoUrl())
                                .currentCity(employee.getCurrentCity())
                                .currentStreet(employee.getCurrentStreet())
                                .currentState(employee.getCurrentState())
                                .currentZip(employee.getCurrentZip())
                                .currentCountry(employee.getCurrentCountry())
                                .permanentStreet(employee.getPermanentStreet())
                                .permanentCity(employee.getPermanentCity())
                                .permanentState(employee.getPermanentState())
                                .emergencyContactName(employee.getEmergencyContactName())
                                .emergencyContactMobile(employee.getEmergencyContactMobile())
                                .emergencyContactRelationship(employee.getEmergencyContactRelationship())
                                .dateOfJoining(employee.getDateOfJoining())
                                .reportingManager(employee.getReportingManager())
                                .workLocation(employee.getWorkLocation())
                                .employmentType(employee.getEmploymentType())
                                .designation(employee.getDesignation())
                                .department(employee.getDepartment())
                                .role(employee.getRole().getName())
                                .accountHolderName(employee.getAccountHolderName())
                                .bankName(employee.getBankName())
                                .branchName(employee.getBranchName())
                                .accountNumber(employee.getAccountNumber())
                                .ifscSwiftCode(employee.getIfscSwiftCode())
                                .aadharNumber(employee.getAadharNumber())
                                .panNumber(employee.getPanNumber())
                                .disbursementMethod(employee.getDisbursementMethod())
                                .annualCtc(employee.getAnnualCtc())
                                .monthlyGross(employee.getMonthlyGross())
                                .basicSalary(employee.getBasicSalary())
                                .performanceBonus(employee.getPerformanceBonus())
                                .professionalTax(employee.getProfessionalTax())
                                .identityProofUrl(employee.getIdentityProofUrl())
                                .educationCertUrl(employee.getEducationCertUrl())
                                .employmentProofUrl(employee.getEmploymentProofUrl())
                                .otherDocUrls(employee.getOtherDocUrls())
                                .status(employee.getStatus())
                                .createdAt(employee.getCreatedAt())
                                .updatedAt(employee.getUpdatedAt())
                                .build();
        }
}