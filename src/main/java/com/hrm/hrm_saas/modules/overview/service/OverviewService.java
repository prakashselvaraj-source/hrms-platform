package com.hrm.hrm_saas.modules.overview.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.attendance.entity.Attendance;
import com.hrm.hrm_saas.modules.attendance.repository.AttendanceRepository;
import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.model.EmployeeDTO;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.leave.dto.LeaveRequestResponseDto;
import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;
import com.hrm.hrm_saas.modules.leave.repository.LeaveRequestRepository;
import com.hrm.hrm_saas.modules.overview.dto.DesignMemberResponse;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OverviewService {

        private final EmployeeRepository employeeRepository;
        private final AttendanceRepository attendanceRepository;
        private final LeaveRequestRepository leaveRequestRepository;
        private final UserRepository userRepository;

        private final List<String> avatarColors = List.of(
                        "#6366f1",
                        "#0ea5e9",
                        "#06b6d4",
                        "#10b981",
                        "#f59e0b",
                        "#f97316",
                        "#ef4444",
                        "#ec4899",
                        "#8b5cf6",
                        "#818cf8");

        public List<DesignMemberResponse> getDesignMembers(String tenantId, String email) {
                // First, find the current employee to know their department
                Employee currentEmployee = employeeRepository.findFirstByTenant_CompanyNameAndWorkEmail(tenantId, email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                System.out.println("DEBUG Overview: currentEmployee email=" + email + ", tenant="
                                + (currentEmployee.getTenant() != null ? currentEmployee.getTenant().getCompanyName()
                                                : "null"));

                String department = currentEmployee.getDepartment();

                if (department == null || department.isEmpty()) {
                        department = "Engineering"; // Fallback to Engineering if no department is set
                }

                List<Employee> employees = employeeRepository.findByTenant_CompanyNameAndDepartmentIgnoreCase(tenantId,
                                department);

                Random random = new Random();

                return employees.stream()
                                .limit(3)
                                .map(employee -> {

                                        boolean isOnline = false;

                                        User user = userRepository
                                                        .findFirstByEmailIgnoreCase(employee.getWorkEmail())
                                                        .orElse(null);

                                        if (user != null &&
                                                        user.getLastSeen() != null) {

                                                isOnline = user
                                                                .getLastSeen()
                                                                .isAfter(
                                                                                LocalDateTime.now().minusMinutes(5));
                                                System.out.println("User: " + employee.getWorkEmail() + ", lastSeen: "
                                                                + user.getLastSeen() + ", isOnline: " + isOnline);
                                        }

                                        return DesignMemberResponse.builder()
                                                        .employeeId(employee.getId())
                                                        .name(employee.getFirstName() + " " + employee.getLastName())
                                                        .designation(employee.getDesignation())
                                                        .isOnline(isOnline)
                                                        .avatarColor(
                                                                        avatarColors.get(
                                                                                        random.nextInt(avatarColors
                                                                                                        .size())))
                                                        .build();
                                })
                                .toList();
        }

        public EmployeeDTO getProfile(String tenantId, String email) {
                Employee employee = employeeRepository.findFirstByTenant_CompanyNameAndWorkEmail(tenantId, email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
                System.out.println("employee: " + employee);
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

        public List<Attendance> getAttendance(String tenantId, String email) {
                return attendanceRepository.findByEmployeeIdAndTenantId(email, tenantId);
        }

        public List<LeaveRequestResponseDto> getRequests(
                        String tenantId,
                        String email) {

                List<LeaveRequest> leaves = leaveRequestRepository
                                .findByTenantIdAndEmployee_WorkEmailOrderByStartDateDesc(
                                                tenantId,
                                                email);

                System.out.println("leaves: " + leaves);

                return leaves.stream()
                                .map(this::mapToDto)
                                .toList();
        }

        private LeaveRequestResponseDto mapToDto(
                        LeaveRequest leave) {

                return LeaveRequestResponseDto.builder()
                                .id(leave.getId())
                                .leaveType(
                                                leave.getLeavePolicy() != null
                                                                ? leave.getLeavePolicy().getName()
                                                                : null)
                                .reason(leave.getReason())
                                .startDate(leave.getStartDate())
                                .endDate(leave.getEndDate())
                                .dayType(leave.getDayType())
                                .applyWithOption(leave.getApplyWithOption())
                                .selectedHoliday(leave.getSelectedHoliday())
                                .status(leave.getStatus()) // <-- FIXED
                                .build();
        }

        public DesignMemberResponse getReportingManager(
                        String tenantId,
                        String email) {

                Employee employee = employeeRepository
                                .findFirstByTenant_CompanyNameAndWorkEmail(
                                                tenantId,
                                                email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                String managerName = employee.getReportingManager();
                System.out.println("Employee: " + employee.getWorkEmail() + ", ReportingManager name from record: '"
                                + managerName + "'");

                if (managerName == null || managerName.trim().isEmpty()) {
                        return null;
                }

                // Clean the name string (handle non-breaking spaces and multiple spaces)
                String cleanedName = managerName.trim().replaceAll("\\s+", " ");
                String[] names = cleanedName.split(" ");

                String firstName = names[0].trim();
                String lastName = names.length > 1 ? names[1].trim() : "";

                System.out.println("Searching for manager: firstName='" + firstName + "', lastName='" + lastName
                                + "', fullName='" + cleanedName + "', tenantId='" + tenantId + "'");

                // DIAGNOSTIC: List all employees in this tenant to see what's in the DB
                System.out.println("DIAGNOSTIC: Listing ALL employees in tenant '" + tenantId + "':");
                employeeRepository.findAll().stream()
                                .filter(e -> e.getTenant() != null
                                                && e.getTenant().getCompanyName().equalsIgnoreCase(tenantId))
                                .forEach(e -> System.out.println(" - Found Employee: '" + e.getFirstName() + "' '"
                                                + e.getLastName() + "' (Dept: " + e.getDepartment() + ")"));

                // FETCH ALL EMPLOYEES AND FIND MANAGER IN JAVA TO BYPASS DB COMPARISON ISSUES
                List<Employee> allEmployees = employeeRepository.findAll().stream()
                                .filter(e -> e.getTenant() != null
                                                && e.getTenant().getCompanyName().equalsIgnoreCase(tenantId))
                                .toList();

                // Handle case where reportingManager might be an email or a name
                Employee manager = null;
                if (managerName.contains("@")) {
                        System.out.println("DEBUG Overview: Reporting manager appears to be an email: " + managerName);
                        manager = allEmployees.stream()
                                        .filter(e -> e.getWorkEmail().equalsIgnoreCase(managerName.trim()))
                                        .findFirst()
                                        .orElse(null);
                }

                if (manager == null) {
                        // Try name-based search if email search failed or it's not an email
                        String searchTarget = cleanedName.toLowerCase().replaceAll("[^a-z0-9]", "");
                        System.out.println("DEBUG Overview: Searching by name. Target: '" + searchTarget + "'");
                        
                        manager = allEmployees.stream()
                                        .filter(e -> {
                                                String dbName = (e.getFirstName() + e.getLastName()).toLowerCase().replaceAll("[^a-z0-9]", "");
                                                boolean match = dbName.equals(searchTarget);
                                                return match;
                                        })
                                        .findFirst()
                                        .orElse(null);
                }

                if (manager == null) {
                        System.out.println("DEBUG Overview: Manager NOT found with either email or name search.");
                        return DesignMemberResponse.builder()
                                        .name(managerName)
                                        .isOnline(false)
                                        .build();
                }

                System.out.println("DEBUG Overview: Manager found: " + manager.getWorkEmail());

                boolean isOnline = false;

                User user = userRepository
                                .findFirstByEmailIgnoreCase(manager.getWorkEmail())
                                .orElse(null);

                System.out.println("DEBUG ReportingManager: Manager=" + manager.getFirstName()
                                + " " + manager.getLastName() + ", WorkEmail="
                                + manager.getWorkEmail() + ", UserFound=" + (user != null)
                                + ", lastSeen=" + (user != null ? user.getLastSeen() : "N/A"));

                if (user != null &&
                                user.getLastSeen() != null) {

                        isOnline = user
                                        .getLastSeen()
                                        .isAfter(LocalDateTime.now().minusMinutes(5));
                        System.out.println("Manager User: " + manager.getWorkEmail()
                                        + ", lastSeen: " + user.getLastSeen() + ", isOnline: "
                                        + isOnline);
                }

                return DesignMemberResponse.builder()
                                .employeeId(manager.getId())
                                .name(
                                                manager.getFirstName()
                                                                + " "
                                                                + manager.getLastName())
                                .isOnline(isOnline)
                                .build();
        }
}
