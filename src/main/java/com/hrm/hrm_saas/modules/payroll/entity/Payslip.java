package com.hrm.hrm_saas.modules.payroll.entity;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.payroll.enums.PayslipStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payslips")
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String tenantId;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String month; // e.g. "March 2026"
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate paymentDate;

    private BigDecimal grossEarnings;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    private PayslipStatus status;

    @OneToMany(mappedBy = "payslip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalaryComponent> components;

    private String pdfUrl; // Path to stored PDF if any

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
