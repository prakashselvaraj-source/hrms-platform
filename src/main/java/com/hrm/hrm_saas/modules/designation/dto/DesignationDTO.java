package com.hrm.hrm_saas.modules.designation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DesignationDTO {
    private String id;
    private String name;
    private String code;
    private String description;
    private Boolean isActive;
}
