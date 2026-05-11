package com.hrm.hrm_saas.modules.payroll.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payroll_policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tenantId;

    // Configuration
    private String payCycleFrequency; // Monthly, Bi-weekly, Weekly
    private Integer standardPayDate; // e.g., 28
    private String lopDeductionRule; // Deduct based on attendance, Fixed
    private String overtimePolicy; // Include, Exclude
    private Integer lopThresholdDays;
    private Integer avgWorkingDays;

    // Default Component Percentages
    private Double basicPercentage; // e.g., 40.0
    private Double hraPercentage; // e.g., 20.0
    private Double pfPercentage; // e.g., 12.0
}
