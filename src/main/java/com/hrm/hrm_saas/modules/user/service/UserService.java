package com.hrm.hrm_saas.modules.user.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.tenant.dto.TenantResponseDTO;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.user.dto.CreateUserRequest;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import javax.management.RuntimeErrorException;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final TenantRepository tenantRepository;
        private final EmployeeRepository employeeRepository;

        public TenantResponseDTO getTenantByEmail(String email) {

                System.out.println("Looking up user by email: " + email);

                User user = userRepository.findFirstByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return new TenantResponseDTO(
                                user.getTenant().getId(),
                                user.getTenant().getCompanyName(),
                                user.getTenant().getCompanyCode());
        }

        public CreateUserRequest createUser(CreateUserRequest dto) {

                Optional<User> user = userRepository.findFirstByEmail(dto.getEmail());

                if (user.isPresent()) {
                        throw new RuntimeException("User Already exists");
                }

                System.out.println("Attempting to find tenant with identifier: " + dto.getTenant());
                Tenant tenant = tenantRepository.findByCompanyCode(dto.getTenant())
                                .or(() -> tenantRepository.findByCompanyName(dto.getTenant()))
                                .orElseThrow(() -> new RuntimeException("Tenant not found"));

                Employee employee = employeeRepository.findFirstByWorkEmail(dto.getEmail())
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                System.out.println("employee" + dto);
                User userdata = User.builder()
                                .name(dto.getUsername())
                                .role(dto.getRole())
                                .email(dto.getEmail())
                                .tenant(tenant)
                                .password(passwordEncoder.encode(dto.getPassword()))
                                .build();
                userRepository.save(userdata);

                return CreateUserRequest.builder()
                                .email(userdata.getEmail())
                                .role(userdata.getRole())
                                .build();

        }

        public User findByEmail(String email) {

                return userRepository.findFirstByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }
}