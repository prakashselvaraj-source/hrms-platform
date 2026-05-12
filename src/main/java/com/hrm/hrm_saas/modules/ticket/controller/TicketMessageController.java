package com.hrm.hrm_saas.modules.ticket.controller;

import com.hrm.hrm_saas.modules.ticket.model.ChatMessageDTO;
import com.hrm.hrm_saas.modules.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class TicketMessageController {

    private final TicketService ticketService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO chatMessage) {
        ticketService.saveMessage(chatMessage);
    }

    @GetMapping("/api/tickets/{id}/messages")
    @ResponseBody
    public List<ChatMessageDTO> getChatHistory(@PathVariable Long id) {
        return ticketService.getChatHistory(id);
    }
}
