package com.hrm.hrm_saas.modules.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TenantResponseDTO {
    private Long id;
    private String companyName;
    private String companyCode;
}
