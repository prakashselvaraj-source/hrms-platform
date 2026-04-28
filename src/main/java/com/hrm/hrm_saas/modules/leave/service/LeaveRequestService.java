package com.hrm.hrm_saas.modules.leave.service;

import java.time.LocalDate;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hrm.hrm_saas.common.security.JwtUtil;
import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.leave.dto.*;
import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;
import com.hrm.hrm_saas.modules.leave.entity.LeavePolicy;
import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;
import com.hrm.hrm_saas.modules.leave.repository.LeavePolicyRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveRequestRepository;
import com.hrm.hrm_saas.modules.leave.engine.LeavePolicyEngine;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

        private final LeaveRequestRepository leaveRequestRepository;
        private final EmployeeRepository employeeRepository;
        private final LeavePolicyRepository leavePolicyRepository;
        private final ObjectMapper objectMapper;
        private final LeavePolicyEngine leavePolicyEngine;

        // ===========================
        // SUBMIT LEAVE
        // ===========================
        public String submitLeaveRequest(String tenantId, LeaveRequestDto dto, MultipartFile attachment, String token) {

                String cleanToken = token.startsWith("Bearer ")
                                ? token.substring(7)
                                : token;

                String email = JwtUtil.extractEmail(cleanToken);

                Employee employee = employeeRepository.findByWorkEmail(email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                String fileName = null;

                if (attachment != null && !attachment.isEmpty()) {
                        fileName = attachment.getOriginalFilename();
                }

                LeavePolicy policy = leavePolicyRepository.findByLeaveType_IdAndTenantId(dto.getLeaveType(), tenantId)
                                .orElseThrow(() -> new RuntimeException("Invalid leave type"));

                if (policy.isAccrualEnabled()) {
                        System.out.println("Accrual is enabled");
                } else {
                        System.out.println("Accrual is disabled");
                }

                ApplyLeaveDTO applyDTO = new ApplyLeaveDTO();
                applyDTO.setLeaveTypeId(dto.getLeaveType());
                applyDTO.setStartDate(dto.getFromDate());
                applyDTO.setEndDate(dto.getToDate());
                applyDTO.setReason(dto.getReason());

                leavePolicyEngine.validate(tenantId, String.valueOf(employee.getId()), applyDTO);

                LeaveRequest leaveRequest = LeaveRequest.builder()
                                .employee(employee)
                                .tenantId(tenantId)
                                .leaveType(policy.getName())
                                .leavePolicy(policy)
                                .reason(dto.getReason())
                                .startDate(dto.getFromDate())
                                .endDate(dto.getToDate())
                                .year(dto.getYear())
                                .fromTime(dto.getFromTime())
                                .toTime(dto.getToTime())
                                .teamMailId(dto.getTeamMailId())
                                .dayType(dto.getDayType())
                                .applyWithOption(dto.getApplyWithOption())
                                .selectedHoliday(dto.getSelectedHoliday())
                                .status("PENDING")
                                .attachment(fileName)
                                .build();

                System.out.println("leaveRequest " + leaveRequest);

                leaveRequestRepository.save(leaveRequest);

                return "Leave request submitted successfully";
        }

        // ===========================
        // DASHBOARD
        // ===========================
        public LeaveDashboardResponse getLeaveDashboard(String tenantId, String token, int year) {

                String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
                String email = JwtUtil.extractEmail(cleanToken);

                Employee employee = employeeRepository.findByWorkEmail(email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                LocalDate start = LocalDate.of(year, 1, 1);
                LocalDate end = LocalDate.of(year, 12, 31);

                // ===========================
                // 1. FETCH LEAVE REQUESTS (UI DATA)
                // ===========================
                List<LeaveRequest> leaveRequests = leaveRequestRepository.findLeavesInRange(
                                email,
                                tenantId,
                                start,
                                end);

                List<LeaveRequestResponseDto> leaveDtos = leaveRequests.stream()
                                .map(lr -> LeaveRequestResponseDto.builder()
                                                .id(lr.getId())
                                                .leaveType(lr.getLeaveType()) // fix after Error 1
                                                .reason(lr.getReason())
                                                .startDate(lr.getStartDate())
                                                .endDate(lr.getEndDate())
                                                .dayType(lr.getDayType())
                                                .applyWithOption(lr.getApplyWithOption())
                                                .selectedHoliday(lr.getSelectedHoliday())
                                                .status(lr.getStatus())
                                                .build())
                                .collect(java.util.stream.Collectors.toList()); // ✅ instead of toList()

                // ===========================
                // 2. FETCH ALL LEAVE TYPES (CONFIG)
                // ===========================
                List<LeavePolicy> leavePolicies = leavePolicyRepository.findByTenantId(tenantId);

                // ===========================
                // 3. FETCH SUMMARY FROM DB (FAST)
                // ===========================
                List<Object[]> summaryData = leaveRequestRepository.getLeaveSummaryByEmail(
                                email,
                                tenantId,
                                start,
                                end);

                // Convert to Map
                Map<String, Long> summaryMap = new HashMap<>();
                for (Object[] row : summaryData) {

                        if (row[0] == null)
                                continue; // ✅ FIX: avoid null crash

                        String type = ((String) row[0]).toLowerCase().trim();
                        Long count = (Long) row[1];

                        summaryMap.put(type, count);
                }

                System.out.println("summaryMap" + summaryMap);
                // ===========================
                // 4. BUILD FINAL SUMMARY (INCLUDING ZERO)
                // ===========================
                List<LeaveSummaryItemDto> summaryList = leavePolicies.stream()
                                .map(policy -> {
                                        String type = policy.getLeaveType() != null ? policy.getLeaveType().getName()
                                                        : policy.getName();

                                        Map<String, Object> accrualMap = null;
                                        try {
                                                if (policy.getAccrualRules() != null) {
                                                        accrualMap = objectMapper.readValue(policy.getAccrualRules(),
                                                                        Map.class);
                                                }
                                        } catch (Exception e) {
                                                // Log or handle error
                                        }

                                        return LeaveSummaryItemDto.builder()
                                                        .leaveType(type)
                                                        .count(summaryMap.getOrDefault(policy.getId().toLowerCase(),
                                                                        0L))
                                                        .accrual(accrualMap)
                                                        .build();
                                })
                                .toList();

                // ===========================
                // FINAL RESPONSE
                // ===========================
                return LeaveDashboardResponse.builder()
                                .leaves(leaveDtos)
                                .summary(summaryList)
                                .build();
        }

        public LeaveRequestManagementResponseDTO getAllLeaveRequests(String tenantId, String token, int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

                System.out.println("Pageable: " + pageable);

                Page<LeaveRequest> pageData = leaveRequestRepository
                                .findByTenantId(tenantId, pageable);

                List<Object[]> statsList = leaveRequestRepository.getLeaveStats(tenantId);

                Object[] statsRaw = (statsList != null && !statsList.isEmpty())
                                ? statsList.get(0)

                                : null;
                List<LeaveRequestAdminResponseDto> content = pageData.getContent().stream()
                                .map(lr -> LeaveRequestAdminResponseDto.builder()
                                                .id(lr.getId())
                                                .employeeName(lr.getEmployee().getFirstName() + " "
                                                                + lr.getEmployee().getLastName())
                                                .employeeDesignation(lr.getEmployee().getDesignation())
                                                .leaveType(lr.getLeaveType())
                                                .startDate(lr.getStartDate())
                                                .endDate(lr.getEndDate())
                                                .dayType(lr.getDayType())
                                                .reason(lr.getReason())
                                                .status(lr.getStatus())
                                                .createdAt(lr.getCreatedAt())
                                                .build())
                                .toList();

                LeaveRequestPaginationDTO pagination = LeaveRequestPaginationDTO.builder()
                                .page(pageData.getNumber())
                                .size(pageData.getSize())
                                .totalElements(pageData.getTotalElements())
                                .totalPages(pageData.getTotalPages())
                                .build();

                LeaveRequestStatsDTO stats = LeaveRequestStatsDTO.builder()
                                .total(statsRaw != null && statsRaw[0] != null
                                                ? ((Number) statsRaw[0]).longValue()
                                                : 0L)
                                .pending(statsRaw != null && statsRaw[1] != null
                                                ? ((Number) statsRaw[1]).longValue()
                                                : 0L)
                                .approved(statsRaw != null && statsRaw[2] != null
                                                ? ((Number) statsRaw[2]).longValue()
                                                : 0L)
                                .rejected(statsRaw != null && statsRaw[3] != null
                                                ? ((Number) statsRaw[3]).longValue()
                                                : 0L)
                                .build();

                return LeaveRequestManagementResponseDTO.builder()
                                .data(content)
                                .pagination(pagination)
                                .stats(stats)
                                .build();

        }

        public LeaveRequestAdminResponseDto getLeaveRequestById(String tenantId, String token, Long id) {

                System.out.println("leaveRequest by Idddddddd");
                LeaveRequest lr = leaveRequestRepository.findByTenantIdAndId(tenantId, id)
                                .orElseThrow(() -> new RuntimeException("Leave request not found"));
                return LeaveRequestAdminResponseDto.builder()
                                .id(lr.getId())
                                .employeeName(lr.getEmployee().getFirstName() + " "
                                                + lr.getEmployee().getLastName())
                                .employeeDesignation(lr.getEmployee().getDesignation())
                                .leaveType(lr.getLeaveType())
                                .startDate(lr.getStartDate())
                                .endDate(lr.getEndDate())
                                .dayType(lr.getDayType())
                                .reason(lr.getReason())
                                .status(lr.getStatus())
                                .createdAt(lr.getCreatedAt())
                                .build();
        }

        public String updateLeaveStatus(String tenantId, String token, Long id, String status) {
                System.out.println("tenantId :" + tenantId);
                System.out.println("token :" + token);
                System.out.println("id :" + id);
                System.out.println("status :" + status);
                Optional<LeaveRequest> leaveRequestOptional = leaveRequestRepository.findByTenantIdAndId(tenantId, id);

                if (leaveRequestOptional.isPresent()) {
                        LeaveRequest leaveRequest = leaveRequestOptional.get();
                        leaveRequest.setStatus(status);
                        leaveRequestRepository.save(leaveRequest);
                }

                return "success";
        }
}