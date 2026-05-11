package com.hrm.hrm_saas.modules.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollOverviewDTO {
    private BigDecimal netTakeHome;
    private BigDecimal ytdEarnings;
    private BigDecimal ytdTax;
    private String nextPayDay;
    private String bankName;
    private String accountLastFour;
}
