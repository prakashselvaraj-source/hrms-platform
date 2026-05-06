package com.hrm.hrm_saas.modules.promotion.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    private String previousDesignation;

    private String status;

    private String newDesignation;

    private Long prevAnnualCTC;

    private Long currentAnnualCTC;

    private LocalDate promotionDate;

    private Long salaryAdjustment;

    private String promotionLetterUrl;

    @Column(length = 1000)
    private String reason;

    private String tenantId;
}