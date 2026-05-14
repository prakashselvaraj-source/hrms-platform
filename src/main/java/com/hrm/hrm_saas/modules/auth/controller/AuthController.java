package com.hrm.hrm_saas.modules.auth.controller;

import com.hrm.hrm_saas.modules.auth.dto.RegisterCompanyRequest;
import com.hrm.hrm_saas.modules.auth.dto.AuthResponse;
import com.hrm.hrm_saas.modules.auth.dto.ForgotPasswordRequest;
import com.hrm.hrm_saas.modules.auth.dto.LoginRequest;
import com.hrm.hrm_saas.modules.auth.dto.LoginResponse;
import com.hrm.hrm_saas.modules.auth.dto.ResetPasswordRequest;
import com.hrm.hrm_saas.modules.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-company")
    public AuthResponse registerCompany(@RequestBody RegisterCompanyRequest request) {
        System.out.println("Received registration request: " + request);
        return authService.registerCompany(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        System.out.println("Received login request: " + request);
        return authService.login(request);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = authService.emailExists(email);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {

        authService.handleForgotPassword(request.getEmail());

        return ResponseEntity.ok("If an account exists, reset link has been sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Received send-otp request for email: " + email);
        authService.sendOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        System.out.println("Received OTP verification request: " + request);
        boolean isValid = authService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }
}