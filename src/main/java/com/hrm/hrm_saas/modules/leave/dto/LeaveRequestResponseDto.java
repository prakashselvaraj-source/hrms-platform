package com.hrm.hrm_saas.modules.leave.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveRequestResponseDto {
    private Long id;
    private String leaveType;
    private String reason;
    private LocalDate startDate;
    private LocalDate endDate;
    private String dayType;
    private String applyWithOption;
    private String selectedHoliday;
    private String status;
    // private LeaveBalanceDto leaveBalance;
}
