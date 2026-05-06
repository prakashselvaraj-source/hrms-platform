package com.hrm.hrm_saas.modules.resignation.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResignationPageResponse {
    private List<ResignationResponseDTO> resignations;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
