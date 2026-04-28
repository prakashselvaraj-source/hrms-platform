package com.hrm.hrm_saas.modules.leave.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "leave_policies")
public class LeavePolicy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String tenantId;
    
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;
    
    @Column(columnDefinition = "TEXT")
    private String generalConfig;
    
    @Column(columnDefinition = "TEXT")
    private String accrualRules;

    @Column(columnDefinition = "TEXT")
    private String usageRules;

    @Column(columnDefinition = "TEXT")
    private String restrictions;

    @Column(columnDefinition = "TEXT")
    private String combinationRules;

    @Column(columnDefinition = "TEXT")
    private String encashmentRules;

    @Column(columnDefinition = "TEXT")
    private String applicabilityRules;

    private boolean accrualEnabled;
    private boolean active;
    private Integer version;

      private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
