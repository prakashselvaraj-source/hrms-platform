package com.hrm.hrm_saas.modules.leave.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeavePolicyResponseDTO {
    
    private String id;
    private String name;

    private Map<String, Object> general;
    private Map<String, Object> accrual;
    private Map<String, Object> usage;
    private Map<String, Object> restrictions;
    private Map<String, Object> combination;
    private Map<String, Object> encashment;
    private Map<String, Object> applicability;
}
