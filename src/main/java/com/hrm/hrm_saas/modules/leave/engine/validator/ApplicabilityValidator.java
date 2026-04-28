package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ApplicabilityValidator {

    public void validateApplicability(Map<String, Object> applicability, String userId) {

        List<String> departments = (List<String>) applicability.get("departments");

        String userDepartment = "IT";

        if (departments != null && !departments.contains(userDepartment)) {
            throw new RuntimeException("Leave not applicable for your department");
        }
    }
}