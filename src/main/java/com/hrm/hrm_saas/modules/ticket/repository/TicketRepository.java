package com.hrm.hrm_saas.modules.ticket.repository;

import com.hrm.hrm_saas.modules.ticket.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByTenantId(String tenantId, Pageable pageable);
    Optional<Ticket> findByIdAndTenantId(Long id, String tenantId);
    
    // Find tickets created by or assigned to an employee
    Page<Ticket> findByTenantIdAndRaisedByOrAssignedTo(String tenantId, String raisedBy, String assignedTo, Pageable pageable);

    long countByTenantIdAndStatus(String tenantId, com.hrm.hrm_saas.modules.ticket.model.TicketStatus status);
}
