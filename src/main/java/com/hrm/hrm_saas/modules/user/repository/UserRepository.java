package com.hrm.hrm_saas.modules.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByEmail(String email);
    Optional<User> findFirstByEmailIgnoreCase(String email);

    Optional<User> findByEmailAndTenant(String email, Tenant tenant);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    Optional<User> findByTenant_IdAndEmail(
            Long tenantId,
            String email);
}