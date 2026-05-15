package com.hrm.hrm_saas.modules.leave.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
import com.hrm.hrm_saas.modules.leave.entity.LeavePolicy;
import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;
import com.hrm.hrm_saas.modules.leave.repository.LeavePolicyRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveRequestRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveTypeRepository;
import com.hrm.hrm_saas.modules.leave.engine.LeavePolicyEngine;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

        private final LeaveRequestRepository leaveRequestRepository;
        private final EmployeeRepository employeeRepository;
        private final LeavePolicyRepository leavePolicyRepository;
        private final LeaveTypeRepository leaveTypeRepository;
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

                Employee employee = employeeRepository.findFirstByWorkEmail(email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                String fileName = null;

                if (attachment != null && !attachment.isEmpty()) {
                        fileName = attachment.getOriginalFilename();
                }

                System.out.println("Processing leave request for employee: " + employee.getFirstName() + " " + employee.getLastName());
                String leaveTypeId = dto.getLeaveType();
                System.out.println("leaveTypeId received: " + leaveTypeId + ", tenantId: " + tenantId);

                // 1. Try to find by ID (as LeaveType ID)
                Optional<LeavePolicy> policyOpt = leavePolicyRepository.findByLeaveType_IdAndTenantId(leaveTypeId,
                                tenantId).stream().findFirst();
                System.out.println("Step 1 (findByLeaveType_IdAndTenantId): " + policyOpt);

                // 2. If not found, try to find by ID (as LeavePolicy ID directly)
                if (policyOpt.isEmpty()) {
                        policyOpt = leavePolicyRepository.findByIdAndTenantId(leaveTypeId, tenantId);
                        System.out.println("Step 2 (findByIdAndTenantId): " + policyOpt);
                }

                // 3. If not found, try to find by Code or Name (as LeaveType Code/Name)
                if (policyOpt.isEmpty()) {
                        policyOpt = leaveTypeRepository.findByTenantIdAndCode(tenantId, leaveTypeId)
                                        .flatMap(lt -> leavePolicyRepository.findByLeaveType_IdAndTenantId(lt.getId(),
                                                        tenantId).stream().findFirst());
                        System.out.println("Step 3 (by code): " + policyOpt);
                }

                if (policyOpt.isEmpty()) {
                        policyOpt = leaveTypeRepository.findByTenantIdAndName(tenantId, leaveTypeId)
                                        .flatMap(lt -> leavePolicyRepository.findByLeaveType_IdAndTenantId(lt.getId(),
                                                        tenantId).stream().findFirst());
                        System.out.println("Step 4 (by name): " + policyOpt);
                }

                // 4. Absolute Fallbacks: Try finding without tenantId in case of mismatch
                if (policyOpt.isEmpty()) {
                        policyOpt = leavePolicyRepository.findByLeaveType_Id(leaveTypeId).stream().findFirst();
                        System.out.println("Step 5 (findByLeaveType_Id no tenant): " + policyOpt);
                }

                if (policyOpt.isEmpty()) {
                        policyOpt = leavePolicyRepository.findById(leaveTypeId);
                        System.out.println("Step 6 (findById): " + policyOpt);
                }

                // 5. If still not found, check if the LeaveType exists at all (with or without
                // tenant)
                if (policyOpt.isEmpty()) {
                        Optional<?> leaveTypeExists = leaveTypeRepository.findByIdAndTenantId(leaveTypeId, tenantId);
                        if (leaveTypeExists.isPresent()) {
                                throw new RuntimeException(
                                                "Leave type exists but no leave policy is configured for it. " +
                                                                "Please ask admin to configure a leave policy for this leave type.");
                        }
                }

                LeavePolicy policy = policyOpt
                                .orElseThrow(() -> new RuntimeException("Invalid leave type: " + leaveTypeId));

                // Update DTO with actual ID for downstream logic (engine, etc)
                dto.setLeaveType(policy.getLeaveType().getId());

                System.out.println("policy found: " + policy.getName());

                System.out.println("Checking Policy Configuration for: " + policy.getName());

                try {
                        // 1. Check Accrual Rules (e.g., maxAnnualQuota)
                        Map<String, Object> accrual = policy.getAccrualRules();
                        if (accrual == null || accrual.isEmpty()) {
                                throw new RuntimeException("Accrual rules (quota) are not configured for "
                                                + policy.getName() + ". Please contact Admin.");
                        }

                        Object maxQuotaObj = accrual.get("maxAnnualQuota");
                        if (maxQuotaObj == null) {
                                throw new RuntimeException("Annual quota is not defined for " + policy.getName()
                                                + ". Please contact Admin.");
                        }

                        int maxAnnualQuota = parseInteger(maxQuotaObj);

                        if (maxAnnualQuota >= 0) {
                                Long daysTaken = leaveRequestRepository.countDaysByEmployeeAndPolicyAndYear(
                                                employee.getId(), policy.getId(), dto.getYear());

                                long currentRequestDays = ChronoUnit.DAYS.between(dto.getFromDate(), dto.getToDate())
                                                + 1;

                                if (daysTaken + currentRequestDays > maxAnnualQuota) {
                                        throw new RuntimeException("You have exceeded your annual quota for "
                                                        + policy.getName() + ". Remaining balance: "
                                                        + Math.max(0, maxAnnualQuota - daysTaken) + " days.");
                                }

                                String accrualType = (String) accrual.get("accrualType");
                                if (accrualType == null)
                                        accrualType = (String) accrual.get("Accrual Type");
                                if (accrualType == null)
                                        accrualType = (String) accrual.get("Accural Type");

                                if (accrualType != null && !accrualType.isEmpty()) {
                                        Integer leavesPerCycle = parseInteger(accrual.get("leavesPerCycle"));
                                        if (leavesPerCycle == null || leavesPerCycle == 0) {
                                                leavesPerCycle = parseInteger(accrual.get("Leaves Per Cycle"));
                                        }

                                        if ((leavesPerCycle == null || leavesPerCycle == 0) && maxAnnualQuota > 0) {
                                                if ("monthly".equalsIgnoreCase(accrualType))
                                                        leavesPerCycle = maxAnnualQuota / 12;
                                                else if ("quarterly".equalsIgnoreCase(accrualType))
                                                        leavesPerCycle = maxAnnualQuota / 4;
                                                else if ("bi-monthly".equalsIgnoreCase(accrualType))
                                                        leavesPerCycle = maxAnnualQuota / 6;
                                        }

                                        if (leavesPerCycle != null && leavesPerCycle > 0) {
                                                LocalDate[] range = getPeriodRange(dto.getFromDate(), accrualType);
                                                if (range != null) {
                                                        List<com.hrm.hrm_saas.modules.leave.entity.LeaveRequest> cycleLeaves = leaveRequestRepository
                                                                        .findLeavesInRange(
                                                                                        employee.getId(),
                                                                                        policy.getId(), tenantId,
                                                                                        range[0], range[1]);

                                                        long cycleTaken = cycleLeaves.stream()
                                                                        .mapToLong(lr -> ChronoUnit.DAYS.between(
                                                                                        lr.getStartDate(),
                                                                                        lr.getEndDate()) + 1)
                                                                        .sum();

                                                        if (cycleTaken + currentRequestDays > leavesPerCycle) {
                                                                throw new RuntimeException("Maximum allowed per "
                                                                                + accrualType + " for "
                                                                                + policy.getName() + " is "
                                                                                + leavesPerCycle + ". Already took "
                                                                                + cycleTaken + " days.");
                                                        }
                                                }
                                        }
                                }
                        }

                        // 2. Check Usage Rules (e.g., minDays, maxDays, maxPerMonth)
                        Map<String, Object> usage = policy.getUsageRules();
                        if (usage != null && !usage.isEmpty()) {
                                long currentRequestDays = ChronoUnit.DAYS.between(dto.getFromDate(), dto.getToDate())
                                                + 1;
                                int maxPerMonth = parseInteger(usage.get("maxPerMonth"));
                                if (maxPerMonth > 0) {
                                        LocalDate startOfMonth = dto.getFromDate().withDayOfMonth(1);
                                        LocalDate endOfMonth = dto.getFromDate()
                                                        .withDayOfMonth(dto.getFromDate().lengthOfMonth());

                                        List<com.hrm.hrm_saas.modules.leave.entity.LeaveRequest> monthLeaves = leaveRequestRepository
                                                        .findLeavesInRange(
                                                                        employee.getId(), policy.getId(), tenantId,
                                                                        startOfMonth, endOfMonth);

                                        long daysInMonth = monthLeaves.stream()
                                                        .mapToLong(lr -> ChronoUnit.DAYS.between(lr.getStartDate(),
                                                                        lr.getEndDate()) + 1)
                                                        .sum();

                                        if (daysInMonth + currentRequestDays > maxPerMonth) {
                                                throw new RuntimeException("Maximum days allowed per month for "
                                                                + policy.getName()
                                                                + " is " + maxPerMonth + ". Already took " + daysInMonth
                                                                + " days.");
                                        }
                                }
                        }

                        // 3. Check Restrictions (e.g., requiresAttachment)
                        Map<String, Object> restrictions = policy.getRestrictions();
                        if (restrictions != null && !restrictions.isEmpty()) {
                                boolean attRequired = Boolean.TRUE.equals(restrictions.get("requiresAttachment")) ||
                                                Boolean.TRUE.equals(restrictions.get("documentRequired"));

                                if (attRequired && fileName == null) {
                                        throw new RuntimeException("Attachment is required by the " + policy.getName()
                                                        + " policy.");
                                }
                        }
                } catch (RuntimeException e) {
                        throw e;
                } catch (Exception e) {
                        System.err.println("Error processing policy configuration: " + e.getMessage());
                }

                if (policy.isAccrualEnabled()) {
                        System.out.println("Accrual logic is enabled for this policy");
                }

                ApplyLeaveDTO applyDTO = new ApplyLeaveDTO();
                applyDTO.setLeaveTypeId(dto.getLeaveType());
                applyDTO.setStartDate(dto.getFromDate());
                applyDTO.setEndDate(dto.getToDate());
                applyDTO.setReason(dto.getReason());

                leavePolicyEngine.validate(tenantId, employee, applyDTO);

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

                System.out.println("Saving leave request for " + leaveRequest.getLeaveType());

                leaveRequestRepository.save(leaveRequest);

                return "Leave request submitted successfully";
        }

        // ===========================
        // DASHBOARD
        // ===========================
        public LeaveDashboardResponse getLeaveDashboard(String tenantId, String token, int year) {

                String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
                String email = JwtUtil.extractEmail(cleanToken);

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

                System.out.println("leavePolicies" + leavePolicies);
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

                                        Map<String, Object> accrualMap = policy.getAccrualRules();

                                        return LeaveSummaryItemDto.builder()
                                                        .id(policy.getLeaveType().getId())
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

        public List<LeaveRequestAdminResponseDto> getMyLeaveRequests(String tenantId, String token, int page,
                        int size) {
                System.out.println("tenantId :" + tenantId);
                System.out.println("token :" + token);

                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

                String cleanToken = token.startsWith("Bearer ")
                                ? token.substring(7)
                                : token;

                String email = JwtUtil.extractEmail(cleanToken);

                Employee employee = employeeRepository.findFirstByWorkEmail(email)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                // System.out.println("employeessss" + employee);
                Page<LeaveRequest> pageData = leaveRequestRepository.findByTenantIdAndEmployee(tenantId,
                                employee, pageable);

                // System.out.println("pageData.getContent(): " + pageData.getContent());

                return pageData.getContent().stream().map(lr -> LeaveRequestAdminResponseDto.builder()
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
                                .build()).toList();
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

        private LocalDate[] getPeriodRange(LocalDate date, String type) {
                LocalDate start;
                LocalDate end;

                switch (type.toLowerCase()) {
                        case "monthly":
                                start = date.withDayOfMonth(1);
                                end = date.withDayOfMonth(date.lengthOfMonth());
                                break;
                        case "quarterly":
                                int month = date.getMonthValue();
                                int startMonth = ((month - 1) / 3) * 3 + 1;
                                start = LocalDate.of(date.getYear(), startMonth, 1);
                                end = start.plusMonths(2).withDayOfMonth(start.plusMonths(2).lengthOfMonth());
                                break;
                        case "bi-monthly":
                                // Assumes Jan-Feb, Mar-Apr, etc.
                                int m = date.getMonthValue();
                                int sm = (m % 2 == 0) ? m - 1 : m;
                                start = LocalDate.of(date.getYear(), sm, 1);
                                end = start.plusMonths(1).withDayOfMonth(start.plusMonths(1).lengthOfMonth());
                                break;
                        case "annually":
                                start = LocalDate.of(date.getYear(), 1, 1);
                                end = LocalDate.of(date.getYear(), 12, 31);
                                break;
                        default:
                                return null;
                }
                return new LocalDate[] { start, end };
        }

        private int parseInteger(Object value) {
                if (value == null)
                        return 0;
                if (value instanceof Integer)
                        return (Integer) value;
                if (value instanceof String) {
                        try {
                                return Integer.parseInt((String) value);
                        } catch (Exception e) {
                                return 0;
                        }
                }
                if (value instanceof Number)
                        return ((Number) value).intValue();
                return 0;
        }

}