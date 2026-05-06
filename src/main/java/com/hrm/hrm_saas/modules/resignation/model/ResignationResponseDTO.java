package com.hrm.hrm_saas.modules.resignation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResignationResponseDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate resignationDate;
    private LocalDate lastWorkingDay;
    private String reason;
    private String description;
    private String status;
    private String documentUrl;
    private LocalDateTime createdAt;
}
