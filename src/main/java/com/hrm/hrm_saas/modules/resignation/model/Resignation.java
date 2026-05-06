package com.hrm.hrm_saas.modules.resignation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "resignations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resignation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private LocalDate resignationDate;

    @Column(nullable = false)
    private LocalDate lastWorkingDay;

    @Column(nullable = false)
    private String reason;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    private String documentUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
