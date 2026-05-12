package com.hrm.hrm_saas.modules.payroll.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPayrollOverviewDTO {
    private BigDecimal totalPayrollCost;
    private BigDecimal totalNetPayout;
    private Long employeesProcessed;
    private Long totalEmployees;
    private BigDecimal totalDeductions;
    private Integer lopCases;
    private String currentMonth;
    private String cycleStatus;
    private Integer currentStep;
    private List<PayrollAlertDTO> alerts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayrollAlertDTO {
        private Long id;
        private String type; // error, warning, info
        private String title;
        private String desc;
        private String category;
    }
}
