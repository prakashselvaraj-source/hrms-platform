package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;

@Component
public class RestrictionValidator {

    public void validateRestrictions(Map<String, Object> restrictions, ApplyLeaveDTO dto, com.hrm.hrm_saas.modules.employee.model.Employee employee) {
        if (restrictions == null || restrictions.isEmpty()) return;

        // 1. Notice Period Check
        Integer noticeDays = parseInteger(restrictions.get("noticePeriodDays"));
        if (noticeDays != null) {
            long diff = ChronoUnit.DAYS.between(LocalDate.now(), dto.getStartDate());
            if (diff < noticeDays) {
                throw new RuntimeException("Apply leave " + noticeDays + " days before");
            }
        }

        // 2. Gender Restriction (e.g., "Male Only", "Female Only")
        String genderRest = (String) restrictions.get("genderRestriction");
        if (genderRest != null && !genderRest.equalsIgnoreCase("Any") && !genderRest.equalsIgnoreCase("Immediately")) {
             if (genderRest.contains("Male") && !"Male".equalsIgnoreCase(employee.getGender())) {
                 throw new RuntimeException("This leave type is only applicable for Male employees.");
             }
             if (genderRest.contains("Female") && !"Female".equalsIgnoreCase(employee.getGender())) {
                 throw new RuntimeException("This leave type is only applicable for Female employees.");
             }
        }

        // 3. Max Consecutive Days
        Integer maxConsec = parseInteger(restrictions.get("maxConsecDays"));
        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        if (maxConsec != null && days > maxConsec) {
            throw new RuntimeException("Maximum consecutive days for this leave is " + maxConsec);
        }
    }

    private Integer parseInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Number) return ((Number) value).intValue();
        if (value instanceof String) {
            try { return Integer.parseInt((String) value); } catch (Exception e) { return null; }
        }
        return null;
    }
}