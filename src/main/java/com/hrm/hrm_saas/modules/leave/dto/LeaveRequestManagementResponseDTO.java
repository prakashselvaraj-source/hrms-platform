package com.hrm.hrm_saas.modules.leave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestManagementResponseDTO {
    private List<LeaveRequestAdminResponseDto> data;
    private LeaveRequestPaginationDTO pagination;
    private LeaveRequestStatsDTO stats;
}
