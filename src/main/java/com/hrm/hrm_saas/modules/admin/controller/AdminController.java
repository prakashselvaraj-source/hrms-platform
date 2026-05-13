package com.hrm.hrm_saas.modules.admin.controller;

import com.hrm.hrm_saas.modules.admin.entity.Admin;
import com.hrm.hrm_saas.modules.admin.service.AdminService;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .flatMap(user -> adminService.getAdminProfile(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<Admin> updateProfile(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.saveAdminProfile(admin));
    }
}
