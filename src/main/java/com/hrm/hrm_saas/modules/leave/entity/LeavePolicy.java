package com.hrm.hrm_saas.modules.leave.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> generalConfig;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> accrualRules;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> usageRules;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> restrictions;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> combinationRules;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> encashmentRules;

  @Convert(converter = com.hrm.hrm_saas.common.converter.JsonToMapConverter.class)
  @Column(columnDefinition = "TEXT")
  private java.util.Map<String, Object> applicabilityRules;

  private boolean accrualEnabled;
  private boolean active;
  private Integer version;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
