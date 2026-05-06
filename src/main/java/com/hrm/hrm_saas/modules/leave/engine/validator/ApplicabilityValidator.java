package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ApplicabilityValidator {

    public void validateApplicability(Map<String, Object> applicability, com.hrm.hrm_saas.modules.employee.model.Employee employee) {
        if (applicability == null || applicability.isEmpty()) return;

        String applyTo = (String) applicability.get("applyTo");
        if ("All Employees".equalsIgnoreCase(applyTo)) return;

        // 1. Check Departments
        List<String> allowedDepts = (List<String>) applicability.get("departments");
        if (allowedDepts != null && !allowedDepts.isEmpty()) {
            String empDept = employee.getDepartment();
            if (empDept != null && !allowedDepts.stream().anyMatch(d -> d.equalsIgnoreCase(empDept))) {
                throw new RuntimeException("This leave policy is not applicable to your department (" + empDept + ").");
            }
        }

        // 2. Check Employee Types (Full-time, Part-time, etc.)
        List<String> allowedTypes = (List<String>) applicability.get("employeeTypes");
        if (allowedTypes != null && !allowedTypes.isEmpty()) {
            String empType = employee.getEmploymentType();
            if (empType != null && !allowedTypes.stream().anyMatch(t -> t.equalsIgnoreCase(empType))) {
                throw new RuntimeException("This leave policy is not applicable to your employment type (" + empType + ").");
            }
        }

        // 3. Check Locations
        List<String> allowedLocations = (List<String>) applicability.get("locations");
        if (allowedLocations != null && !allowedLocations.isEmpty()) {
            String empLoc = employee.getWorkLocation();
            if (empLoc != null && !allowedLocations.stream().anyMatch(l -> l.equalsIgnoreCase(empLoc))) {
                throw new RuntimeException("This leave policy is not applicable to your work location (" + empLoc + ").");
            }
        }
    }
}