package com.hrm.hrm_saas.modules.tenant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {
    private final TenantRepository tenantRepository;

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkCompany(@RequestParam String name){

        String code = name.toLowerCase()
                      .replaceAll(" ","")
                      .replaceAll("[^a-z0-9]","");

        boolean exists = tenantRepository.findByCompanyCode(code).isPresent();

        return ResponseEntity.ok(exists);
    }
}
