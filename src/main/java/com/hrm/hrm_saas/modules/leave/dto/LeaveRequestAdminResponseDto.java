package com.hrm.hrm_saas.modules.leave.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveRequestAdminResponseDto {
    private Long id;
    private String employeeName;
    private String employeeDesignation;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String dayType;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
}
