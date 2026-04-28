package com.hrm.hrm_saas.modules.leave.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyRequestDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyResponseDTO;
import com.hrm.hrm_saas.modules.leave.service.LeavePolicyService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leave-policies")
@RequiredArgsConstructor
public class LeavePolicyController {

    private final LeavePolicyService service;

    @PostMapping
    public LeavePolicyResponseDTO create(
            @RequestBody LeavePolicyRequestDTO dto,
            Principal principal,
            HttpServletRequest request) {

        System.out.println("leavePolicy12345" + dto);
        String tenantId = (String) request.getAttribute("tenantId");
        return service.saveOrUpdatePolicy(tenantId, dto);
    }

    @GetMapping
    public List<LeavePolicyResponseDTO> getAll(Principal principal,
            @RequestHeader("X-Tenant-Id") String tenantId) {

        System.out.println("leavePolicy12345" + tenantId);
        return service.getPolicies(tenantId);
    }

}
