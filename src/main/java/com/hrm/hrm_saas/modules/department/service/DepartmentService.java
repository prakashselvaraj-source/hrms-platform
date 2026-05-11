package com.hrm.hrm_saas.modules.department.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.department.entity.Department;
import com.hrm.hrm_saas.modules.department.model.DepartmentDTO;
import com.hrm.hrm_saas.modules.department.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        departmentRepository.findByTenantIdAndCode(dto.getTenantId(), dto.getCode()).ifPresent(d -> {
            throw new RuntimeException("Department code already exists");
        });
        Department department = toEntity(dto);
        return toDTO(departmentRepository.save(department));
    }

    public List<DepartmentDTO> getAllDepartments(String tenantId) {
        return departmentRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(String tenantId, String id) {
        return departmentRepository.findById(id)
                .filter(d -> d.getTenantId().equals(tenantId))
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public DepartmentDTO updateDepartment(String tenantId, String id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .filter(d -> d.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Department not found"));

        departmentRepository.findByTenantIdAndCode(tenantId, dto.getCode())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Department code already exists");
                    }
                });

        department.setName(dto.getName());
        department.setCode(dto.getCode());
        department.setManager(dto.getManager());
        department.setIsActive(dto.getIsActive());

        return toDTO(departmentRepository.save(department));
    }

    public void deleteDepartment(String tenantId, String id) {
        Department department = departmentRepository.findById(id)
                .filter(d -> d.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Department not found"));
        departmentRepository.delete(department);
    }

    private DepartmentDTO toDTO(Department department) {
        return DepartmentDTO.builder()
                .id(department.getId())
                .tenantId(department.getTenantId())
                .name(department.getName())
                .code(department.getCode())
                .manager(department.getManager())
                .isActive(department.getIsActive())
                .build();
    }

    private Department toEntity(DepartmentDTO dto) {
        return Department.builder()
                .id(dto.getId())
                .tenantId(dto.getTenantId())
                .name(dto.getName())
                .code(dto.getCode())
                .manager(dto.getManager())
                .isActive(dto.getIsActive())
                .build();
    }

}
