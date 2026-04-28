package com.hrm.hrm_saas.modules.leave.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "leave_types", indexes = {
        @Index(name = "idx_tenant", columnList = "tenant_Id")
}, uniqueConstraints = {
        @UniqueConstraint(columnNames = { "tenant_Id", "code" })
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_Id", nullable = false)
    private String tenantId;

    @Column(nullable = false, length = 100)
    private String name;

    private String code;
    private String description;

    private boolean paid; // Paid vs unpaid (LOP)
    private boolean requiresApproval; // Basic workflow flag
    private boolean attachmentRequired; // good addition (for sick leave)
    private String color; // already there
    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
