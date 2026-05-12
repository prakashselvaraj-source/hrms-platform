package com.hrm.hrm_saas.modules.ticket.controller;

import com.hrm.hrm_saas.modules.ticket.model.TicketDTO;
import com.hrm.hrm_saas.modules.ticket.model.TicketPageResponse;
import com.hrm.hrm_saas.modules.ticket.service.TicketService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    private boolean isTenantForbidden(String headerTenantId, HttpServletRequest request) {
        String tokenTenantId = (String) request.getAttribute("tenantId");
        return tokenTenantId == null || !tokenTenantId.equals(headerTenantId);
    }

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @RequestBody TicketDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = (String) request.getAttribute("email");
        return ResponseEntity.ok(ticketService.createTicket(dto, tenantId, email));
    }

    @GetMapping
    public ResponseEntity<TicketPageResponse> getAllTickets(
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = (String) request.getAttribute("email");
        String role = (String) request.getAttribute("role");
        return ResponseEntity.ok(ticketService.getAllTickets(tenantId, email, role, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(ticketService.getTicketById(id, tenantId));
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<TicketDTO> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketDTO dto,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(ticketService.updateTicket(id, dto, tenantId));
    }

    @PutMapping("/assign/{id}")
    public ResponseEntity<TicketDTO> assignTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String assignedTo = body.get("assignedTo");
        return ResponseEntity.ok(ticketService.assignTicket(id, assignedTo, tenantId));
    }

    @PutMapping("/take/{id}")
    public ResponseEntity<TicketDTO> takeTicket(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = (String) request.getAttribute("email");
        return ResponseEntity.ok(ticketService.takeTicket(id, email, tenantId));
    }

    @PutMapping("/resolve/{id}")
    public ResponseEntity<TicketDTO> resolveTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String note = body.get("note");
        return ResponseEntity.ok(ticketService.resolveTicket(id, note, tenantId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-Tenant-Id") String tenantId,
            HttpServletRequest request) {

        if (isTenantForbidden(tenantId, request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String status = body.get("status");
        TicketDTO dto = TicketDTO.builder().status(status).build();
        return ResponseEntity.ok(ticketService.updateTicket(id, dto, tenantId));
    }
}
