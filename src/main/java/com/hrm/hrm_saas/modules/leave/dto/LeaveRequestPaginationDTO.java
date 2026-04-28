package com.hrm.hrm_saas.modules.leave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequestPaginationDTO {
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
}
