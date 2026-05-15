package com.hrm.hrm_saas.modules.overview.service;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OverviewService {

        private final EmployeeRepository employeeRepository;
        private final AttendanceRepository attendanceRepository;
        private final LeaveRequestRepository leaveRequestRepository;

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

        public List<DesignMemberResponse> getDesignMembers(String tenantId) {

                List<Employee> employees = employeeRepository.findByTenant_CompanyNameAndDepartmentIgnoreCase(tenantId,
                                "Engineering");

                Random random = new Random();

                return employees.stream()
                                .limit(5)
                                .map(employee -> DesignMemberResponse.builder()
                                                .employeeId(employee.getId())
                                                .name(employee.getFirstName() + " " + employee.getLastName())
                                                .role(employee.getRole().getName())
                                                .online(random.nextBoolean())
                                                .avatarColor(
                                                                avatarColors.get(
                                                                                random.nextInt(avatarColors.size())))
                                                .build())
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
}
