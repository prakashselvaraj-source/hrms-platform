package com.hrm.hrm_saas.modules.holiday.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Sort;

import com.hrm.hrm_saas.modules.holiday.model.HolidayDTO;
import com.hrm.hrm_saas.modules.holiday.model.Holiday;
import com.hrm.hrm_saas.modules.holiday.repository.HolidayRepository;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository repository;
    private final TenantRepository tenantRepository;

    public Holiday createHoliday(HolidayDTO dto, String tenantId) {
        Tenant tenant = tenantRepository.findById(Long.parseLong(tenantId))
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Holiday holiday = mapToEntity(dto);
        holiday.setTenant(tenant);

        System.out.println("holiday" + holiday);
        return repository.save(holiday);
    }

    public List<Holiday> getAllHolidays(String tenantId) {
        return repository.findByTenantId(Long.parseLong(tenantId), Sort.by(Sort.Direction.ASC, "id"));
    }

    public Holiday getHolidayById(Long id, String tenantId) {
        return repository.findByIdAndTenantId(id, Long.parseLong(tenantId))
                .orElseThrow(() -> new RuntimeException("Holiday not found or unauthorized"));
    }

    public Holiday updateHoliday(Long id, HolidayDTO dto, String tenantId) {
        Holiday holiday = getHolidayById(id, tenantId);

        holiday.setHolidayName(dto.getHolidayName());
        holiday.setDate(dto.getDate());
        holiday.setCategory(Holiday.Category.valueOf(dto.getCategory().toUpperCase().replace(" ", "_")));
        holiday.setType(Holiday.Type.valueOf(dto.getType().toUpperCase()));

        return repository.save(holiday);
    }

    public void deleteHoliday(Long id, String tenantId) {
        Holiday holiday = getHolidayById(id, tenantId);
        repository.delete(holiday);
    }

    // 🔥 Helper method (clean code)
    private Holiday mapToEntity(HolidayDTO dto) {
        System.out.println("MapToEntity" + dto);
        Holiday holiday = new Holiday();

        holiday.setHolidayName(dto.getHolidayName());
        holiday.setDate(dto.getDate());
        holiday.setCategory(Holiday.Category.valueOf(dto.getCategory().toUpperCase().replace(" ", "_")));
        holiday.setType(Holiday.Type.valueOf(dto.getType().toUpperCase()));

        return holiday;
    }
}