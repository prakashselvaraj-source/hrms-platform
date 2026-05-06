package com.hrm.hrm_saas.modules.leave.engine.validator;

import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;

@Component
public class GeneralValidator {

    public void validateGeneral(Map<String, Object> general, ApplyLeaveDTO dto) {

        Boolean allowHalfDay = (Boolean) general.get("allowHalfDay");

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        if (days < 1) {
            throw new RuntimeException("Invalid leave duration");
        }

        if (Boolean.FALSE.equals(allowHalfDay) && days == 0.5) {
            throw new RuntimeException("Half day not allowed");
        }
    }
}