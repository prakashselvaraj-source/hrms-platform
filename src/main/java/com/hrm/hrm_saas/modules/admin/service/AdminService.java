package com.hrm.hrm_saas.modules.admin.service;

import com.hrm.hrm_saas.modules.admin.entity.Admin;
import com.hrm.hrm_saas.modules.admin.repository.AdminRepository;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    /**
     * Find the Admin profile by userId, or auto-create one if it doesn't exist yet.
     * This handles users who registered before the Admin record was introduced.
     */
    public Optional<Admin> getAdminProfile(Long userId) {
        return adminRepository.findByUserId(userId).or(() -> {
            return userRepository.findById(userId).map(user -> {
                Admin newAdmin = Admin.builder()
                        .user(user)
                        .tenant(user.getTenant())
                        .firstName(user.getName() != null ? user.getName().split(" ")[0] : "")
                        .lastName(user.getName() != null && user.getName().contains(" ")
                                ? user.getName().substring(user.getName().indexOf(" ") + 1) : "")
                        .designation("Administrator")
                        .build();
                return adminRepository.save(newAdmin);
            });
        });
    }

    public Admin saveAdminProfile(Admin admin) {
        return adminRepository.save(admin);
    }
}
