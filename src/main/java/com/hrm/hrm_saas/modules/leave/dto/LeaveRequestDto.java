package com.hrm.hrm_saas.modules.leave.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class LeaveRequestDto {

    private int year;
    private String leaveType; 
    private LocalDate fromDate;
    private LocalDate toDate;
    private String fromTime;
    private String toTime;
    private String teamMailId;
    private String reason;
    private String dayType;
    private String applyWithOption;
    private String selectedHoliday;

}
