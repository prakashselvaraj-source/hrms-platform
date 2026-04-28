package com.hrm.hrm_saas.modules.leave.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.leave.dto.CreateLeaveTypeDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyResponseDTO;
import com.hrm.hrm_saas.modules.leave.service.LeavePolicyService;
import com.hrm.hrm_saas.modules.leave.service.LeaveTypeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService service;
    private final LeavePolicyService policyService;

    @PostMapping
    public ResponseEntity<?> create(
        @RequestHeader("X-Tenant-Id") String tenantId,
        @RequestBody CreateLeaveTypeDTO dto
    )
    {
        return ResponseEntity.ok(service.createLeaveType(tenantId, dto));
    }

    @GetMapping
    public ResponseEntity<?> getAll(
        @RequestHeader("X-Tenant-Id") String tenantId
    ){
        return ResponseEntity.ok(service.getAll(tenantId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
        @RequestHeader("X-Tenant-Id") String tenantId,
        @PathVariable String id
    ){

        System.out.print("ResponseEntity"+tenantId+ id);
        return ResponseEntity.ok(service.getById(tenantId, id));
    }

    @GetMapping("/{id}/configuration")
    public ResponseEntity<?> getConfiguration(
        @RequestHeader("X-Tenant-Id") String tenantId,
        @PathVariable String id
    ){

        System.out.print("configutation"+ tenantId+ id);
        return ResponseEntity.ok(policyService.getLeaveConfiguration(tenantId, id));
    }
}
