package com.hrm.hrm_saas.modules.department.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.department.entity.Department;
import com.hrm.hrm_saas.modules.department.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin("*")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public Department createDepartment(@RequestBody Department department,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        department.setTenantId(tenantId);
        return departmentService.createDepartment(department);
    }

    @GetMapping
    public List<Department> getAllDepartments(@RequestHeader("X-Tenant-Id") String tenantId) {
        return departmentService.getAllDepartments(tenantId);
    }

}
