package com.hrm.hrm_saas.modules.auth.service;

import com.hrm.hrm_saas.common.service.EmailService;
import com.hrm.hrm_saas.modules.auth.dto.RegisterCompanyRequest;
import com.hrm.hrm_saas.modules.auth.dto.AuthResponse;
import com.hrm.hrm_saas.modules.auth.dto.LoginRequest;
import com.hrm.hrm_saas.modules.auth.dto.LoginResponse;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import com.hrm.hrm_saas.common.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmailService emailService;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final java.util.Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    public void sendOtp(String email) {
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        otpStorage.put(email, otp);
        System.out.println("Email send");
        emailService.sendEmail(
                email,
                "Your Verification Code",
                "Your OTP for WorkSphere registration is: " + otp + "\n\nThis code will expire shortly.");
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    public AuthResponse registerCompany(RegisterCompanyRequest request) {

        String subdomain = request.getSubdomain();

        if (subdomain == null || subdomain.isEmpty()) {
            subdomain = request.getCompanyName()
                    .toLowerCase()
                    .replaceAll(" ", "")
                    .replaceAll("[^a-z0-9]", "");
        }

        if (tenantRepository.findByCompanyCode(subdomain).isPresent()) {
            throw new RuntimeException("Subdomain already taken");
        }

        Tenant tenant = Tenant.builder()
                .companyName(request.getCompanyName())
                .companyCode(subdomain)
                .build();

        tenantRepository.save(tenant);

        User admin = User.builder()
                .name(request.getAdminName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ADMIN")
                .tenant(tenant)
                .build();

        userRepository.save(admin);

        try {
            emailService.sendWelcomeEmail(
                    request.getEmail(),
                    request.getCompanyName(),
                    subdomain);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return AuthResponse.builder()
                .message("Company registered successfully")
                .companyCode(subdomain)
                .build();
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String tenantCode = user.getTenant().getCompanyName();

        String token = JwtUtil.generateToken(user.getEmail(), tenantCode, user.getRole());

        return LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public void handleForgotPassword(String email) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("FORGOT PASSWORD FAILURE: No user found with email: " + email);
            return;
        }
        System.out.println("Hai");
        User user = userOpt.get();

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "Reset Your Password",
                "Click the link to reset your password:\n" + resetLink);

        System.out.println("You Goddamn right");
    }

    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}
