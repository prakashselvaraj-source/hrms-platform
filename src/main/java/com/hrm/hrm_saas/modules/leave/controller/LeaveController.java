package com.hrm.hrm_saas.modules.leave.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeaveResponseDTO;
import com.hrm.hrm_saas.modules.leave.service.LeaveService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public LeaveResponseDTO applyLeave(
            @RequestBody ApplyLeaveDTO dto,
            Principal principal,
            HttpServletRequest request) {
        String userId = principal.getName();
        String tenantId = (String) request.getAttribute("tenantId");
        System.out.println("applyLeave" + principal.getName());

        return leaveService.applyLeave(tenantId, userId, dto);
    }
}