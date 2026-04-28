package com.hrm.hrm_saas.modules.leave.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ApplyLeaveDTO {
    private String leaveTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
}
