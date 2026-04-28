package com.hrm.hrm_saas.modules.leave.dto;

import java.util.Map;

import lombok.Data;

@Data
public class LeavePolicyDTO {
    private String name;

    private Map<String, Object> generalConfig;
    private Map<String, Object> accrualRules;
    private Map<String, Object> usageRules;
    private Map<String, Object> restrictions;
    private Map<String, Object> combinationRules;
    private Map<String, Object> encashmentRules;
    private Map<String, Object> applicabilityRules;

    private String leaveTypeId;
    private boolean active;
}
