package com.hrm.hrm_saas.modules.leave.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveDashboardResponse {

    private List<LeaveRequestResponseDto> leaves;
    private List<LeaveSummaryItemDto> summary;

}
