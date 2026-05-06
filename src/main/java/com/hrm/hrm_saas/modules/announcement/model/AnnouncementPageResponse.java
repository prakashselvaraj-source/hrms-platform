package com.hrm.hrm_saas.modules.announcement.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnnouncementPageResponse {
    private List<AnnouncementDTO> announcements;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
