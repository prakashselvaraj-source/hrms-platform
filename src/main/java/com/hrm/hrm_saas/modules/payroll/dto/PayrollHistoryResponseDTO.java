package com.hrm.hrm_saas.modules.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollHistoryResponseDTO {
    private List<PayrollCycleDTO> cycles;
    private int totalPages;
    private long totalElements;
    private BigDecimal totalYTD;
    private BigDecimal avgMonthlyCost;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayrollCycleDTO {
        private String id;
        private String month;
        private String year;
        private String status;
        private BigDecimal grossSalary;
        private BigDecimal totalDeductions;
        private BigDecimal netPayout;
        private Integer employees;
    }
}
