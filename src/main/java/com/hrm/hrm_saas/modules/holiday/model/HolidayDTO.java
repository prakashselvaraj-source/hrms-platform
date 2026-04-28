package com.hrm.hrm_saas.modules.holiday.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HolidayDTO {
    @NotBlank(message = "HolidayName is required")
    private String holidayName;
    @NotNull(message = "Date is required")
    private LocalDate date;
    @NotBlank(message = "Category is required")
    private String category;
    @NotBlank(message = "type is required")
    private String type;

}