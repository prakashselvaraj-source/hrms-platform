package com.hrm.hrm_saas.modules.holiday.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import com.hrm.hrm_saas.modules.holiday.model.HolidayDTO;
import com.hrm.hrm_saas.modules.holiday.model.Holiday;
import com.hrm.hrm_saas.modules.holiday.model.HolidayPageResponse;
import com.hrm.hrm_saas.modules.holiday.repository.HolidayRepository;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository repository;
    private final TenantRepository tenantRepository;

    private Tenant getTenant(String companyName) {
        return tenantRepository.findByCompanyName(companyName)
                .orElseThrow(() -> new RuntimeException("Tenant not found with name: " + companyName));
    }

    public HolidayDTO createHoliday(HolidayDTO dto, String tenantId) {
        Tenant tenant = getTenant(tenantId);
        Holiday holiday = toEntity(dto);
        holiday.setTenant(tenant);
        return toDTO(repository.save(holiday));
    }

    public HolidayPageResponse getAllHolidays(String tenantId, Pageable pageable) {
        Page<Holiday> page = repository.findByTenantCompanyName(tenantId, pageable);
        
        List<HolidayDTO> holidays = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new HolidayPageResponse(
            holidays,
            page.getNumber(),
            page.getTotalPages(),
            page.getTotalElements()
        );
    }

    public HolidayDTO getHolidayById(Long id, String tenantId) {
        return repository.findByIdAndTenantCompanyName(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Holiday not found or unauthorized"));
    }

    public HolidayDTO updateHoliday(Long id, HolidayDTO dto, String tenantId) {
        Holiday existing = repository.findByIdAndTenantCompanyName(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Holiday not found or unauthorized"));

        existing.setHolidayName(dto.getHolidayName());
        existing.setDate(dto.getDate());
        existing.setCategory(Holiday.Category.valueOf(dto.getCategory().toUpperCase().replace(" ", "_")));
        existing.setType(Holiday.Type.valueOf(dto.getType().toUpperCase()));

        return toDTO(repository.save(existing));
    }

    public void deleteHoliday(Long id, String tenantId) {
        Holiday holiday = repository.findByIdAndTenantCompanyName(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Holiday not found or unauthorized"));
        repository.delete(holiday);
    }

    private HolidayDTO toDTO(Holiday holiday) {
        return HolidayDTO.builder()
                .id(holiday.getId())
                .holidayName(holiday.getHolidayName())
                .date(holiday.getDate())
                .category(holiday.getCategory().name())
                .type(holiday.getType().name())
                .tenantId(holiday.getTenant() != null ? holiday.getTenant().getCompanyName() : null)
                .build();
    }

    private Holiday toEntity(HolidayDTO dto) {
        Holiday holiday = new Holiday();
        holiday.setHolidayName(dto.getHolidayName());
        holiday.setDate(dto.getDate());
        holiday.setCategory(Holiday.Category.valueOf(dto.getCategory().toUpperCase().replace(" ", "_")));
        holiday.setType(Holiday.Type.valueOf(dto.getType().toUpperCase()));
        return holiday;
    }
}