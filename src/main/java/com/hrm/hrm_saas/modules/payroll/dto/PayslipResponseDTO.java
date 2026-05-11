package com.hrm.hrm_saas.modules.payroll.dto;

import com.hrm.hrm_saas.modules.payroll.enums.PayslipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayslipResponseDTO {
    private String id;
    private String month;
    private String period;
    private BigDecimal amount;
    private PayslipStatus status;
    private LocalDate date;
    private List<ComponentDTO> earnings;
    private List<ComponentDTO> deductions;
    private BigDecimal grossTotal;
    private BigDecimal totalDeductions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComponentDTO {
        private String name;
        private BigDecimal amount;
    }
}
