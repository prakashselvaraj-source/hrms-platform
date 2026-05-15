package com.hrm.hrm_saas.modules.ticket.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.ticket.model.*;
import com.hrm.hrm_saas.modules.ticket.repository.ChatMessageRepository;
import com.hrm.hrm_saas.modules.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EmployeeRepository employeeRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public TicketDTO createTicket(TicketDTO dto, String tenantId, String raisedBy) {
        String name = raisedBy;
        String photoUrl = null;

        Optional<Employee> empOpt = employeeRepository.findFirstByWorkEmail(raisedBy);
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            name = emp.getFirstName() + " " + emp.getLastName();
            photoUrl = emp.getPhotoUrl();
        }

        Ticket ticket = Ticket.builder()
                .tenantId(tenantId)
                .subject(dto.getSubject())
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .description(dto.getDescription())
                .status(TicketStatus.OPEN.name())
                .raisedBy(raisedBy)
                .raisedByName(name)
                .raisedByPhotoUrl(photoUrl)
                .attachments(dto.getAttachments())
                .build();

        return toDTO(ticketRepository.save(ticket));
    }

    public TicketPageResponse getAllTickets(String tenantId, String currentUserEmail, String role, Pageable pageable) {
        Page<Ticket> page;
        
        // Admin can see all tickets
        if ("ADMIN".equalsIgnoreCase(role)) {
            page = ticketRepository.findByTenantId(tenantId, pageable);
        } else {
            // Employees see only their own tickets and tickets assigned to them
            page = ticketRepository.findByTenantIdAndRaisedByOrAssignedTo(
                    tenantId, currentUserEmail, currentUserEmail, pageable);
        }
        
        List<TicketDTO> tickets = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new TicketPageResponse(
                tickets,
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements());
    }

    public TicketDTO getTicketById(Long id, String tenantId) {
        return ticketRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));
    }

    @Transactional
    public TicketDTO updateTicket(Long id, TicketDTO dto, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        if (dto.getStatus() != null) {
            ticket.setStatus(dto.getStatus());
        }
        if (dto.getSubject() != null) {
            ticket.setSubject(dto.getSubject());
        }
        if (dto.getCategory() != null) {
            ticket.setCategory(dto.getCategory());
        }
        if (dto.getPriority() != null) {
            ticket.setPriority(dto.getPriority());
        }
        if (dto.getDescription() != null) {
            ticket.setDescription(dto.getDescription());
        }
        if (dto.getAttachments() != null) {
            ticket.setAttachments(dto.getAttachments());
        }
        if (dto.getAdditionalInfo() != null) {
            ticket.setAdditionalInfo(dto.getAdditionalInfo());
        }

        TicketDTO updated = toDTO(ticketRepository.save(ticket));
        messagingTemplate.convertAndSend("/topic/ticket/" + id, updated);
        messagingTemplate.convertAndSend("/topic/tickets", updated);
        return updated;
    }

    @Transactional
    public TicketDTO assignTicket(Long id, String assignedTo, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setAssignedTo(assignedTo);
        ticket.setStatus(TicketStatus.ASSIGNED.name());
        ticket.setAssignedAt(LocalDateTime.now());
        
        TicketDTO updated = toDTO(ticketRepository.save(ticket));
        messagingTemplate.convertAndSend("/topic/ticket/" + id, updated);
        messagingTemplate.convertAndSend("/topic/tickets", updated);
        messagingTemplate.convertAndSendToUser(assignedTo, "/queue/notifications", "New ticket assigned: " + id);
        
        return updated;
    }

    @Transactional
    public TicketDTO takeTicket(Long id, String assignedByEmail, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setAssignedTo(assignedByEmail);
        ticket.setStatus(TicketStatus.IN_PROGRESS.name());
        ticket.setAssignedAt(LocalDateTime.now());
        
        TicketDTO updated = toDTO(ticketRepository.save(ticket));

        messagingTemplate.convertAndSend("/topic/tickets", updated);
        
        return updated;
    }

    @Transactional
    public TicketDTO resolveTicket(Long id, String note, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setResolutionNote(note);
        ticket.setStatus(TicketStatus.RESOLVED.name());
        ticket.setResolvedAt(LocalDateTime.now());
        
        TicketDTO updatedTicket = toDTO(ticketRepository.save(ticket));
        
        // Broadcast status update
        messagingTemplate.convertAndSend("/topic/ticket/" + id, updatedTicket);
        messagingTemplate.convertAndSend("/topic/tickets", updatedTicket);
        
        return updatedTicket;
    }

    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO dto) {
        ChatMessage message = ChatMessage.builder()
                .ticketId(dto.getTicketId())
                .senderEmail(dto.getSenderEmail())
                .senderName(dto.getSenderName())
                .content(dto.getContent())
                .isAdmin(dto.isAdmin())
                .build();
        
        message = chatMessageRepository.save(message);
        ChatMessageDTO savedDto = toMessageDTO(message);
        
        // Broadcast message to ticket topic
        messagingTemplate.convertAndSend("/topic/ticket/" + dto.getTicketId(), savedDto);
        
        return savedDto;
    }

    public List<ChatMessageDTO> getChatHistory(Long ticketId) {
        return chatMessageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toMessageDTO)
                .collect(Collectors.toList());
    }

    private ChatMessageDTO toMessageDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .ticketId(message.getTicketId())
                .senderEmail(message.getSenderEmail())
                .senderName(message.getSenderName())
                .content(message.getContent())
                .isAdmin(message.isAdmin())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private TicketDTO toDTO(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .tenantId(ticket.getTenantId())
                .subject(ticket.getSubject())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .raisedBy(ticket.getRaisedBy())
                .raisedByName(ticket.getRaisedByName())
                .raisedByPhotoUrl(ticket.getRaisedByPhotoUrl())
                .createdAt(ticket.getCreatedAt())
                .attachments(ticket.getAttachments())
                .assignedTo(ticket.getAssignedTo())
                .resolutionNote(ticket.getResolutionNote())
                .assignedAt(ticket.getAssignedAt())
                .resolvedAt(ticket.getResolvedAt())
                .additionalInfo(ticket.getAdditionalInfo())
                .build();
    }
}
