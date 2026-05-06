package com.hrm.hrm_saas.modules.announcement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import com.hrm.hrm_saas.modules.announcement.model.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    Page<Announcement> findByTenantId(String tenantId, Pageable pageable);

    Optional<Announcement> findByIdAndTenantId(Long id, String tenantId);
}