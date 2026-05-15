package com.hrm.hrm_saas.modules.user.controller;

import com.hrm.hrm_saas.modules.tenant.dto.TenantResponseDTO;
import com.hrm.hrm_saas.modules.user.dto.CreateUserRequest;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // ✅ correct import
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/tenants")
    public TenantResponseDTO getTenantForCurrentUser(Authentication authentication) {

        System.out.println("Authentication object: " + authentication);

        String email = authentication.getName(); // ✅ correct

        System.out.println("Logged in user email: " + email);

        return userService.getTenantByEmail(email);
    }

    @PostMapping("/createUser")
    public ResponseEntity<CreateUserRequest> createUser(
            @RequestBody CreateUserRequest dto, @RequestHeader("X-Tenant-Id") String tenantId) {
        System.out.println("Tenant ID: " + tenantId);
        dto.setTenant(tenantId);
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyDetails(@RequestAttribute String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }
}