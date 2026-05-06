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

    public void validate(String tenantId, com.hrm.hrm_saas.modules.employee.model.Employee employee, ApplyLeaveDTO dto) {

        System.out.println("Validate "+ tenantId + " for employee " + employee.getId() + " dto: " + dto);
        LeavePolicy policy = policyRepository.findByLeaveType_IdAndTenantId(dto.getLeaveTypeId(), tenantId)
                .stream().findFirst()
                .orElseGet(() -> policyRepository.findByLeaveType_Id(dto.getLeaveTypeId())
                        .stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Policy not found for leave type: " + dto.getLeaveTypeId())));

                System.out.print("policy"+policy);
        // 🔥 Delegate to validators
        generalValidator.validateGeneral(policy.getGeneralConfig(), dto);
        usageValidator.validateUsage(policy.getUsageRules(), dto);
        restrictionValidator.validateRestrictions(policy.getRestrictions(), dto, employee);
        applicabilityValidator.validateApplicability(policy.getApplicabilityRules(), employee);
        accrualValidator.validateAccrual(policy.getAccrualRules(), dto);
    }
}