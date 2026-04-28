package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;

@Component
public class UsageValidator {

    public void validateUsage(Map<String, Object> usage, ApplyLeaveDTO dto) {

        Integer minDays = (Integer) usage.get("minDays");
        Integer maxDays = (Integer) usage.get("maxDays");

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        if (minDays != null && days < minDays) {
            throw new RuntimeException("Minimum leave days is " + minDays);
        }

        if (maxDays != null && days > maxDays) {
            throw new RuntimeException("Maximum leave days is " + maxDays);
        }
    }
}