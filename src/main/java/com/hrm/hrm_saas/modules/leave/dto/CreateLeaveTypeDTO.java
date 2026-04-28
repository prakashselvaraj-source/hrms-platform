package com.hrm.hrm_saas.modules.leave.dto;

import lombok.Data;

@Data
public class CreateLeaveTypeDTO {

    private String name;
    private String code;
    private String description;
    private Boolean paid;
    private Boolean requiresApproval;
    private Boolean attachmentRequired;
    private String color;
    private Boolean active;
}