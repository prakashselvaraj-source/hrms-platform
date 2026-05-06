package com.hrm.hrm_saas.modules.employee.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeePageResponse {
    private List<EmployeeDTO> employees;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
