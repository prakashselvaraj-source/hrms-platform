package com.hrm.hrm_saas.modules.leave.engine;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;
import com.hrm.hrm_saas.modules.leave.entity.LeavePolicy;
import com.hrm.hrm_saas.modules.leave.repository.LeavePolicyRepository;
import com.hrm.hrm_saas.modules.leave.engine.validator.*;

@Component
public class LeavePolicyEngine {

    private final LeavePolicyRepository policyRepository;
    private final ObjectMapper objectMapper;

    private final GeneralValidator generalValidator;
    private final UsageValidator usageValidator;
    private final RestrictionValidator restrictionValidator;
    private final ApplicabilityValidator applicabilityValidator;
    private final AccrualValidator accrualValidator;

    public LeavePolicyEngine(
            LeavePolicyRepository policyRepository,
            ObjectMapper objectMapper,
            GeneralValidator generalValidator,
            UsageValidator usageValidator,
            RestrictionValidator restrictionValidator,
            ApplicabilityValidator applicabilityValidator,
            AccrualValidator accrualValidator
    ) {
        this.policyRepository = policyRepository;
        this.objectMapper = objectMapper;
        this.generalValidator = generalValidator;
        this.usageValidator = usageValidator;
        this.restrictionValidator = restrictionValidator;
        this.applicabilityValidator = applicabilityValidator;
        this.accrualValidator = accrualValidator;
    }

    public void validate(String tenantId, String userId, ApplyLeaveDTO dto) {

        System.out.println("Validate"+ tenantId + userId + dto);
        LeavePolicy policy = policyRepository
                .findByTenantId(tenantId)
                .stream()
                .filter(p -> p.getLeaveType().getId().equals(dto.getLeaveTypeId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Policy not found"));

                System.out.print("policy"+policy);
        Map<String, Object> general = parse(policy.getGeneralConfig());
        Map<String, Object> usage = parse(policy.getUsageRules());
        Map<String, Object> restrictions = parse(policy.getRestrictions());
        Map<String, Object> applicability = parse(policy.getApplicabilityRules());
        Map<String, Object> accrual = parse(policy.getAccrualRules());

        // 🔥 Delegate to validators
        generalValidator.validateGeneral(general, dto);
        usageValidator.validateUsage(usage, dto);
        restrictionValidator.validateRestrictions(restrictions, dto);
        applicabilityValidator.validateApplicability(applicability, userId);
        accrualValidator.validateAccrual(accrual, dto);
    }

    private Map<String, Object> parse(String json) {
        if (json == null || json.isEmpty()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            System.err.println("JSON parse error for: " + json);
            return Map.of();
        }
    }
}