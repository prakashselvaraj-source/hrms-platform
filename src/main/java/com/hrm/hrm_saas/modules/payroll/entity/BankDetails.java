package com.hrm.hrm_saas.modules.payroll.entity;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bank_details")
public class BankDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String tenantId;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String accountHolderName;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String accountType; // e.g. Savings, Current
    private String branchName;

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
