package com.hrm.hrm_saas.modules.attendance.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.hrm_saas.modules.attendance.enums.AttendanceStatus;
import lombok.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalDateTime checkIn;

    private LocalDateTime checkOut;

    private Double totalHours;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private boolean late;

}
