package com.hrm.hrm_saas.modules.leave.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveSummaryItemDto {

    private String id;
    private String leaveType;
    private Long count;
    private Map<String, Object> accrual;
}
