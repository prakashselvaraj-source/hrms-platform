package com.hrm.hrm_saas.modules.leave.dto;

import com.hrm.hrm_saas.modules.leave.entity.LeaveStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveResponseDTO {

    private String id;
    private LeaveStatus status;
}