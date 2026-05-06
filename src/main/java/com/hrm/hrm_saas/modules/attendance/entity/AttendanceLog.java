package com.hrm.hrm_saas.modules.attendance.entity;

import java.time.LocalDateTime;

import com.hrm.hrm_saas.modules.attendance.enums.LogType;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "attendance_logs")
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String tenantId;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private LogType type;

}
