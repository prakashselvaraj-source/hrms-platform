package com.hrm.hrm_saas.modules.location.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkLocationDTO {
    private String id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private Boolean isActive;
}
