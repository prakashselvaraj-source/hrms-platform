package com.hrm.hrm_saas.modules.leave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequestStatsDTO {

    private long total;
    private long pending;
    private long approved;
    private long rejected;

}