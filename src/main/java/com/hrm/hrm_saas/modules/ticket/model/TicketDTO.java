package com.hrm.hrm_saas.modules.ticket.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketDTO {
    private Long id;
    private String tenantId;
    private String subject;
    private String category;
    private String priority;
    private String description;
    private String status;
    private String raisedBy;
    private String additionalInfo;
    private String raisedByName;
    private String raisedByPhotoUrl;
    private LocalDateTime createdAt;
    private List<String> attachments;
    private String assignedTo;
    private String resolutionNote;
    private LocalDateTime assignedAt;
    private LocalDateTime resolvedAt;
}
