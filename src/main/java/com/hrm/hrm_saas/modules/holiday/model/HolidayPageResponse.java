package com.hrm.hrm_saas.modules.holiday.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayPageResponse {
    private List<HolidayDTO> holidays;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
