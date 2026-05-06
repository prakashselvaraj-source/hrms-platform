package com.hrm.hrm_saas.modules.leave.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyRequestDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeavePolicyResponseDTO;
import com.hrm.hrm_saas.modules.leave.entity.LeavePolicy;
import com.hrm.hrm_saas.modules.leave.entity.LeaveType;
import com.hrm.hrm_saas.modules.leave.repository.LeavePolicyRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveTypeRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class LeavePolicyService {

    private final LeavePolicyRepository repository;
    private final ObjectMapper objectMapper;
    private final LeaveTypeRepository leaveTypeRepository;

    public LeavePolicyResponseDTO saveOrUpdatePolicy(String tenantId, LeavePolicyRequestDTO dto) {

    LeaveType leaveType = leaveTypeRepository.findById(dto.getLeaveTypeId())
        .orElseThrow(() -> new RuntimeException("Leave type not found"));
        System.out.println("\n");
        System.out.println("LeaveTYpe"+" " +tenantId+ dto.getLeaveTypeId());
        System.out.println("\n");

    LeavePolicy policy = repository
        .findByTenantIdAndLeaveType_Id(tenantId, dto.getLeaveTypeId())
        .stream().findFirst().orElse(new LeavePolicy());

    policy.setTenantId(tenantId);
    policy.setLeaveType(leaveType);

    policy.setName(dto.getName());

    policy.setGeneralConfig(dto.getGeneral());
    policy.setAccrualRules(dto.getAccrual());
    policy.setUsageRules(dto.getUsage());
    policy.setRestrictions(dto.getRestrictions());
    policy.setCombinationRules(dto.getCombination());
    policy.setEncashmentRules(dto.getEncashment());
    policy.setApplicabilityRules(dto.getApplicability());

    // policy.setActive(dto.isActive());

    LeavePolicy saved = repository.save(policy);

    return mapToDTO(saved);
}

    public List<LeavePolicyResponseDTO> getPolicies(String tenantId) {
        return repository.findByTenantId(tenantId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public LeavePolicyResponseDTO getLeaveConfiguration(String tenantId, String leaveTypeId){

        LeavePolicy policy = repository.findByLeaveType_IdAndTenantId(leaveTypeId, tenantId)
        .stream().findFirst().orElse(null);

        if(policy == null){
            return null;
        }

        System.out.println("LeavePOlicyResponseDTO"+policy);
        return mapToDTO(policy);
    }


    private LeavePolicyResponseDTO mapToDTO(LeavePolicy policy) {
        return LeavePolicyResponseDTO.builder()
                .id(policy.getId())
                .name(policy.getName())
                .general(policy.getGeneralConfig())
                .accrual(policy.getAccrualRules())
                .usage(policy.getUsageRules())
                .restrictions(policy.getRestrictions())
                .combination(policy.getCombinationRules())
                .encashment(policy.getEncashmentRules())
                .applicability(policy.getApplicabilityRules())
                .build();
    }
}