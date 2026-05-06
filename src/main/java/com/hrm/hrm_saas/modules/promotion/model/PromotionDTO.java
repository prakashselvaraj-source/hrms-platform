package com.hrm.hrm_saas.modules.promotion.model;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDTO {

    private Long id;
    private Long employeeId;

    private String previousDesignation;
    private String newDesignation;

    private LocalDate promotionDate;

    private Long annualCtc;
    private Long prevAnnualCTC;
    private Long currentAnnualCTC;
    private Long salaryAdjustment;
    private String status;

    private String promotionLetterUrl;
    private String reason;

    private String tenantId;
}