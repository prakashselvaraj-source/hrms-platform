package com.hrm.hrm_saas.modules.ticket.repository;

import com.hrm.hrm_saas.modules.ticket.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
