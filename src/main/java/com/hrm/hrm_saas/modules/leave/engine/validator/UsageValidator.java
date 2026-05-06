package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;

@Component
public class UsageValidator {

    public void validateUsage(Map<String, Object> usage, ApplyLeaveDTO dto) {
        if (usage == null || usage.isEmpty()) return;

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        // Check minDays / maxDays (standard)
        Integer minDays = parseInteger(usage.get("minDays"));
        Integer maxDays = parseInteger(usage.get("maxDays"));

        if (minDays != null && days < minDays) {
            throw new RuntimeException("Minimum leave days is " + minDays);
        }
        if (maxDays != null && days > maxDays) {
            throw new RuntimeException("Maximum leave days is " + maxDays);
        }

        // Check maxPerRequest (from user data)
        Integer maxPerRequest = parseInteger(usage.get("maxPerRequest"));
        if (maxPerRequest != null && days > maxPerRequest) {
            throw new RuntimeException("Maximum days allowed per request is " + maxPerRequest);
        }

        // Check minNoticeDays (from user data)
        Integer minNoticeDays = parseInteger(usage.get("minNoticeDays"));
        if (minNoticeDays != null) {
            long noticeGiven = ChronoUnit.DAYS.between(java.time.LocalDate.now(), dto.getStartDate());
            if (noticeGiven < minNoticeDays) {
                throw new RuntimeException("This leave requires at least " + minNoticeDays + " days of advance notice.");
            }
        }
    }

    private Integer parseInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        if (value instanceof Number) return ((Number) value).intValue();
        return null;
    }
}