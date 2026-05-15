package com.hrm.hrm_saas.modules.leave.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.hrm_saas.modules.employee.model.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Table(name = "leave_requests")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @ToString.Exclude
    private Employee employee;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "leave_type", nullable = false)
    private String leaveType;

    @Column(name = "reason")
    private String reason;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "from_time")
    private String fromTime;

    @Column(name = "to_time")
    private String toTime;

    @Column(name = "team_mail_id")
    private String teamMailId;

    @Column(name = "day_type")
    private String dayType;

    @Column(name = "apply_with_option")
    private String applyWithOption;

    @Column(name = "selected_holiday")
    private String selectedHoliday;

    @Column(name = "attachment")
    private String attachment;

    @ManyToOne
    @JoinColumn(name = "leave_policy_id")
    private LeavePolicy leavePolicy;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}
