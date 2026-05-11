package com.hrm.hrm_saas.modules.ticket.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.ticket.model.Ticket;
import com.hrm.hrm_saas.modules.ticket.model.TicketDTO;
import com.hrm.hrm_saas.modules.ticket.model.TicketPageResponse;
import com.hrm.hrm_saas.modules.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional
    public TicketDTO createTicket(TicketDTO dto, String tenantId, String raisedBy) {
        String name = raisedBy;
        String photoUrl = null;

        Optional<Employee> empOpt = employeeRepository.findByWorkEmail(raisedBy);
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
                .status("OPEN")
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
    public TicketDTO updateTicketStatus(Long id, String status, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setStatus(status);
        return toDTO(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketDTO assignTicket(Long id, String assignedTo, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setAssignedTo(assignedTo);
        ticket.setAssignedAt(LocalDateTime.now());
        return toDTO(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketDTO takeTicket(Long id, String assignedByEmail, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setAssignedTo(assignedByEmail);
        ticket.setStatus("IN_PROGRESS");
        ticket.setAssignedAt(LocalDateTime.now());
        return toDTO(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketDTO resolveTicket(Long id, String note, String tenantId) {
        Ticket ticket = ticketRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Ticket not found or unauthorized"));

        ticket.setResolutionNote(note);
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());
        return toDTO(ticketRepository.save(ticket));
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
                .build();
    }
}
