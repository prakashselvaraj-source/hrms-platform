package com.hrm.hrm_saas.modules.ticket.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketPageResponse {
    private List<TicketDTO> tickets;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
