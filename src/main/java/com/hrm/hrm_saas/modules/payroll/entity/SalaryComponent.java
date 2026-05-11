package com.hrm.hrm_saas.modules.payroll.entity;

import com.hrm.hrm_saas.modules.payroll.enums.ComponentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "salary_components")
public class SalaryComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "payslip_id")
    private Payslip payslip;

    private String name; // e.g. "Basic Pay", "HRA", "TDS"
    
    @Enumerated(EnumType.STRING)
    private ComponentType type;

    private BigDecimal amount;
}
