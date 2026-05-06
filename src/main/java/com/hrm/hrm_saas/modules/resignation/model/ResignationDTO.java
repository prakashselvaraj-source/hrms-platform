package com.hrm.hrm_saas.modules.resignation.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResignationDTO {

    private Long id;

    private String tenantId;

    private Long employeeId;

    @NotNull(message = "Resignation date is required")
    private LocalDate resignationDate;

    @NotNull(message = "Proposed last working day is required")
    private LocalDate lastWorkingDay;

    @NotBlank(message = "Primary reason for leaving is required")
    private String reason;

    @NotBlank(message = "Detailed description is required")
    private String description;

    private String status;

    private String documentUrl;
}
