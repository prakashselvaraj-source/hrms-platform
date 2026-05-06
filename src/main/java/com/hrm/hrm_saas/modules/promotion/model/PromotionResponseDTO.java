package com.hrm.hrm_saas.modules.promotion.model;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PromotionResponseDTO {

    private Long id;
    private String employeeName;

    private String previousDesignation;
    private String newDesignation;

    private LocalDate promotionDate;
    private LocalDate effectiveDate;

    private Double salaryAdjustment;
    private String promotionLetter;
    private String reason;

}