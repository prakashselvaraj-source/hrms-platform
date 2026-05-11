package com.hrm.hrm_saas.modules.payroll.entity;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 19, scale = 2)
    private BigDecimal hra;

    @Column(precision = 19, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(precision = 19, scale = 2)
    private BigDecimal travelAllowance;

    @Column(precision = 19, scale = 2)
    private BigDecimal specialAllowance;

    @Column(precision = 19, scale = 2)
    private BigDecimal performanceBonus;

    // Deductions
    @Column(precision = 19, scale = 2)
    private BigDecimal pfContribution;

    @Column(precision = 19, scale = 2)
    private BigDecimal esiContribution;

    @Column(precision = 19, scale = 2)
    private BigDecimal professionalTax;

    @Column(precision = 19, scale = 2)
    private BigDecimal tds;

    @Column(precision = 19, scale = 2)
    private BigDecimal loanDeduction;

    @Column(nullable = false)
    private LocalDate effectiveFrom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalaryStructureStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = SalaryStructureStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SalaryStructureStatus {
        ACTIVE, INACTIVE, ARCHIVED
    }
}
