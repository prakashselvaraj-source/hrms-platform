package com.hrm.hrm_saas.modules.leave.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hrm.hrm_saas.modules.leave.dto.LeaveDashboardResponse;
import com.hrm.hrm_saas.modules.leave.dto.LeaveRequestAdminResponseDto;
import com.hrm.hrm_saas.modules.leave.dto.LeaveRequestDto;
import com.hrm.hrm_saas.modules.leave.dto.LeaveRequestManagementResponseDTO;
import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;
import com.hrm.hrm_saas.modules.leave.service.LeaveRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leave-management")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping("/get-all-leave-types/{year}")
    public LeaveDashboardResponse getAllLeaveTypesWithUserIdAndYear(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @PathVariable int year) {
        return leaveRequestService.getLeaveDashboard(tenantId, token, year);
    }

    @GetMapping("/get-all-leave-requests")
    public ResponseEntity<LeaveRequestManagementResponseDTO> getAllLeaveRequests(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size

    ) {

        LeaveRequestManagementResponseDTO response = leaveRequestService.getAllLeaveRequests(tenantId, token, page,
                size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee-leave-requests")
    public ResponseEntity<List<LeaveRequestAdminResponseDto>> getMyLeaveRequests(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<LeaveRequestAdminResponseDto> requests = leaveRequestService.getMyLeaveRequests(tenantId, token, page,
                size);
        return ResponseEntity.ok()
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(requests);
    }

    @PostMapping("/submit-leave-request")
    public String submitLeaveRequest(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @ModelAttribute LeaveRequestDto dto,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {

        System.out.println("dto :" + dto);
        System.out.println("attachment :" + attachment);
        System.out.println("token :" + token);
        System.out.println("tenantId :" + tenantId);

        return leaveRequestService.submitLeaveRequest(tenantId, dto, attachment, token);
    }

    @GetMapping("/get-leave-request/{id}")
    public LeaveRequestAdminResponseDto getLeaveRequestById(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return leaveRequestService.getLeaveRequestById(tenantId, token, id);
    }

    @PutMapping("/update-leave-status/{id}")
    public String updateLeaveStatus(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        System.out.println("tenantId :" + tenantId);
        System.out.println("token :" + token);
        System.out.println("id :" + id);
        System.out.println("status :" + status);
        return leaveRequestService.updateLeaveStatus(tenantId, token, id, status);
    }
}
