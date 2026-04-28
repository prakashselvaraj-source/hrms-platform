package com.hrm.hrm_saas.modules.department.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.department.entity.Department;
import com.hrm.hrm_saas.modules.department.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public Department createDepartment(Department department) {
        departmentRepository.findByTenantIdAndCode(department.getTenantId(), department.getCode()).ifPresent(d -> {
            throw new RuntimeException("Department code already exists");
        });
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments(String tenantId) {
        return departmentRepository.findByTenantId(tenantId);
    }

}
