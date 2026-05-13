package com.hrm.hrm_saas.modules.tenant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import jakarta.servlet.http.HttpServletRequest;

import com.hrm.hrm_saas.modules.tenant.dto.OrganizationSetupDTO;
import com.hrm.hrm_saas.modules.tenant.dto.TenantFullDetailsDTO;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.service.TenantService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TenantController {
    private final TenantRepository tenantRepository;
    private final TenantService tenantService;

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkCompany(@RequestParam String name){
        String code = name.toLowerCase()
                      .replaceAll(" ","")
                      .replaceAll("[^a-z0-9]","");
        boolean exists = tenantRepository.findByCompanyCode(code).isPresent();
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/by-code")
    public ResponseEntity<Tenant> getByCode(HttpServletRequest request) {
        String code = (String) request.getAttribute("tenantId");
        return tenantRepository.findByCompanyCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns ALL organization setup data in one call:
     * tenant info + work locations + shifts + modules + plan.
     * Used to hydrate the Organization Setup Wizard on the frontend.
     */
    @GetMapping("/full-details")
    public ResponseEntity<TenantFullDetailsDTO> getFullDetails(HttpServletRequest request) {
        try {
            String code = (String) request.getAttribute("tenantId");
            TenantFullDetailsDTO details = tenantService.getFullDetails(code);
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/setup-complete")
    public ResponseEntity<Tenant> updateSetupStatus(HttpServletRequest request, @RequestParam boolean complete) {
        String code = (String) request.getAttribute("tenantId");
        return tenantRepository.findByCompanyCode(code)
                .map(tenant -> {
                    tenant.setSetupComplete(complete);
                    return ResponseEntity.ok(tenantRepository.save(tenant));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/full-setup")
    public ResponseEntity<Tenant> completeFullSetup(HttpServletRequest request, @RequestBody OrganizationSetupDTO dto) {
        try {
            String code = (String) request.getAttribute("tenantId");
            Tenant tenant = tenantService.completeOrganizationSetup(code, dto);
            return ResponseEntity.ok(tenant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
