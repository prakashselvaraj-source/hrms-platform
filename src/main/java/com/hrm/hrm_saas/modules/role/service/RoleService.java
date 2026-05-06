package com.hrm.hrm_saas.modules.role.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.hrm.hrm_saas.modules.role.model.Role;
import com.hrm.hrm_saas.modules.role.model.RoleDTO;
import com.hrm.hrm_saas.modules.role.repository.RoleRepository;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repo;

    public Role createRole(RoleDTO dto, String tenantId) {
        Role role = Role.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .tenantId(tenantId)
                .accessLevel(dto.getAccessLevel())
                .build();

        return repo.save(role);
    }

    public List<Role> getAllRoles(String tenantId) {
        return repo.findByTenantId(tenantId);
    }

    public Role getRoleById(Long id, String tenantId) {
        Role role = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!role.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized");
        }

        return role;
    }

    public Role updateRole(Long id, RoleDTO dto, String tenantId) {
        Role role = getRoleById(id, tenantId);

        role.setName(dto.getName());
        role.setDescription(dto.getDescription());
        role.setAccessLevel(dto.getAccessLevel());
        return repo.save(role);
    }

    public void deleteRole(Long id, String tenantId) {
        Role role = getRoleById(id, tenantId);
        repo.delete(role);
    }
}