package com.hrm.hrm_saas.modules.holiday.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;

import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "holidays")
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String holidayName;
    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    public enum Category {
        NATIONAL,
        REGIONAL,
        RELIGIOUS,
        COMPANY_SPECIFIC,
        INTERNAL
    }

    public enum Type {
        HOLIDAY,
        RESTRICTED
    }

}