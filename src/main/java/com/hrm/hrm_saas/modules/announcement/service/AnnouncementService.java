package com.hrm.hrm_saas.modules.announcement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.announcement.model.Announcement;
import com.hrm.hrm_saas.modules.announcement.model.AnnouncementDTO;
import com.hrm.hrm_saas.modules.announcement.repository.AnnouncementRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;

import com.hrm.hrm_saas.modules.announcement.model.AnnouncementPageResponse;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository repo;

    public AnnouncementDTO create(AnnouncementDTO dto, String tenantId) {
        Announcement entity = mapToEntity(dto);
        entity.setTenantId(tenantId);
        Announcement saved = repo.save(entity);
        return mapToDTO(saved);
    }

    @Cacheable(value = "announcements", key = "#tenantId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public AnnouncementPageResponse getAll(String tenantId, Pageable pageable) {
        var page = repo.findByTenantId(tenantId, pageable);
        List<AnnouncementDTO> announcements = page.getContent()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return new AnnouncementPageResponse(announcements, page.getNumber(), page.getTotalPages(),
                page.getTotalElements());
    }

    public AnnouncementDTO getById(Long id, String tenantId) {
        Announcement announcement = repo.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return mapToDTO(announcement);
    }

    public AnnouncementDTO update(Long id, AnnouncementDTO dto, String tenantId) {
        Announcement existing = repo.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        existing.setTitle(dto.getTitle());
        existing.setCategory(dto.getCategory());
        existing.setPriority(dto.getPriority());
        existing.setAudience(dto.getAudience());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setMessage(dto.getMessage());
        existing.setTenantId(tenantId);
        existing.setAttachments(dto.getAttachments());

        Announcement updated = repo.save(existing);

        return mapToDTO(updated);
    }

    public void delete(Long id, String tenantId) {
        Announcement existing = repo.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        repo.delete(existing);
    }

    private Announcement mapToEntity(AnnouncementDTO dto) {
        return Announcement.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .audience(dto.getAudience())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .message(dto.getMessage())
                .attachments(dto.getAttachments())
                .build();
    }

    private AnnouncementDTO mapToDTO(Announcement entity) {
        return AnnouncementDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .priority(entity.getPriority())
                .audience(entity.getAudience())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .message(entity.getMessage())
                .attachments(entity.getAttachments())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}