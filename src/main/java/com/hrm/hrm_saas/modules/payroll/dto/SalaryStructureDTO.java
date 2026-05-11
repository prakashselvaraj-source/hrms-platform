package com.hrm.hrm_saas.modules.payroll.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryStructureDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal medicalAllowance;
    private BigDecimal travelAllowance;
    private BigDecimal specialAllowance;
    private BigDecimal performanceBonus;
    
    private BigDecimal pfContribution;
    private BigDecimal esiContribution;
    private BigDecimal professionalTax;
    private BigDecimal tds;
    private BigDecimal loanDeduction;

    private BigDecimal monthlyGross;
    private BigDecimal annualCtc;
    private LocalDate effectiveFrom;
    private String status;
}
