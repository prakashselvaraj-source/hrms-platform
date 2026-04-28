package com.hrm.hrm_saas.modules.leave.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.leave.dto.CreateLeaveTypeDTO;
import com.hrm.hrm_saas.modules.leave.entity.LeaveType;
import com.hrm.hrm_saas.modules.leave.repository.LeaveTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveTypeService {
    
    private final LeaveTypeRepository repository;

    public LeaveType createLeaveType(String tenantId, CreateLeaveTypeDTO dto){

        repository.findByTenantIdAndCode(tenantId, dto.getCode()).ifPresent(l -> {
            throw new RuntimeException("Leave code already exists");
        });
        
LeaveType leaveType = LeaveType.builder()
                            .tenantId(tenantId)
                            .name(dto.getName())
                            .code(dto.getCode())
                            .description(dto.getDescription())
                            .color(dto.getColor())
                            .paid(dto.getPaid())
                            .attachmentRequired(dto.getAttachmentRequired())
                            .requiresApproval(dto.getRequiresApproval())
                            .active(dto.getActive())
                            .build();
        return repository.save(leaveType);
    }


    public List<LeaveType> getAll(String tenantId){
        return repository.findAll()
                .stream()
                .filter(l -> l.getTenantId().equals(tenantId))
                .toList();
    }

    public LeaveType getById(String tenantId, String id){
        return repository.findByIdAndTenantId(id, tenantId)
        .orElseThrow(() -> new RuntimeException("Leave type not found"));
    }


    
    
}
