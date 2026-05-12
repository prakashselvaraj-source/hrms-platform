package com.hrm.hrm_saas.modules.ticket.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long id;
    private Long ticketId;
    private String senderEmail;
    private String senderName;
    private String content;
    private boolean isAdmin;
    private LocalDateTime createdAt;
}
