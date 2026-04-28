package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;

@Component
public class RestrictionValidator {

    public void validateRestrictions(Map<String, Object> restrictions, ApplyLeaveDTO dto) {

        Integer noticeDays = (Integer) restrictions.get("noticePeriodDays");

        if (noticeDays != null) {
            long diff = ChronoUnit.DAYS.between(LocalDate.now(), dto.getStartDate());

            if (diff < noticeDays) {
                throw new RuntimeException("Apply leave " + noticeDays + " days before");
            }
        }
    }
}