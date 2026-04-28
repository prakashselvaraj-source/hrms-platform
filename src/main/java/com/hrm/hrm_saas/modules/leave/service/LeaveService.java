package com.hrm.hrm_saas.modules.leave.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.leave.dto.ApplyLeaveDTO;
import com.hrm.hrm_saas.modules.leave.dto.LeaveResponseDTO;
import com.hrm.hrm_saas.modules.leave.engine.LeavePolicyEngine;
import com.hrm.hrm_saas.modules.leave.entity.Leave;
import com.hrm.hrm_saas.modules.leave.entity.LeaveStatus;
import com.hrm.hrm_saas.modules.leave.repository.LeavePolicyRepository;
import com.hrm.hrm_saas.modules.leave.repository.LeaveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeavePolicyEngine policyEngine;

    public LeaveResponseDTO applyLeave(String tenantId, String userId, ApplyLeaveDTO dto) {

        System.out.println("LeaveResponseDto"+tenantId +userId + dto);
        policyEngine.validate(tenantId, userId, dto);

        int totalDays = (int) (dto.getEndDate().toEpochDay() - dto.getStartDate().toEpochDay()) + 1;

        Leave leave = Leave.builder()
                .tenantId(tenantId)
                .userId(userId)
                .leaveTypeId(dto.getLeaveTypeId())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalDays(totalDays)
                .reason(dto.getReason())
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDate.now().atStartOfDay())
                .build();

        Leave saved = leaveRepository.save(leave);

        // 🔥 STEP 4: Return response
        return LeaveResponseDTO.builder()
                .id(saved.getId())
                .status(saved.getStatus())
                .build();
    }
}