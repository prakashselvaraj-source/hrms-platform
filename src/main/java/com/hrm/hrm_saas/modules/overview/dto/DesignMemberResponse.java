package com.hrm.hrm_saas.modules.overview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DesignMemberResponse {

    private Long employeeId;

    private String name;

    private String designation;

    @com.fasterxml.jackson.annotation.JsonProperty("isOnline")
    private Boolean isOnline;

    private String avatarColor;

}
