package com.hrm.hrm_saas.modules.tenant.dto;

import com.hrm.hrm_saas.modules.location.dto.WorkLocationDTO;
import com.hrm.hrm_saas.modules.shift.dto.ShiftDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationSetupDTO {
    private String companyName;
    private String industry;
    private String companySize;
    private String businessEmail;
    private String phoneNumber;
    private String country;
    private String timezone;
    private String website;
    private String registrationNumber;
    
    @JsonProperty("logoUrl")
    private String logoUrl;
    
    private String selectedPlan;
    private List<WorkLocationDTO> locations;
    private List<ShiftDTO> shifts;
    private Set<String> enabledModules;
}
