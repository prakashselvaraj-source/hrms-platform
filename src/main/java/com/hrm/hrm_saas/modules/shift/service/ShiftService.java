package com.hrm.hrm_saas.modules.shift.service;

import com.hrm.hrm_saas.modules.shift.dto.ShiftDTO;
import com.hrm.hrm_saas.modules.shift.entity.Shift;
import com.hrm.hrm_saas.modules.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public ShiftDTO create(String tenantId, ShiftDTO dto) {
        Shift shift = Shift.builder()
                .tenantId(tenantId)
                .name(dto.getName())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .gracePeriodMinutes(dto.getGracePeriodMinutes())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toDTO(shiftRepository.save(shift));
    }

    public List<ShiftDTO> getAll(String tenantId) {
        return shiftRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ShiftDTO getById(String id, String tenantId) {
        return shiftRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }

    public ShiftDTO update(String id, String tenantId, ShiftDTO dto) {
        Shift shift = shiftRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        shift.setName(dto.getName());
        shift.setStartTime(dto.getStartTime());
        shift.setEndTime(dto.getEndTime());
        shift.setGracePeriodMinutes(dto.getGracePeriodMinutes());
        shift.setIsActive(dto.getIsActive());

        return toDTO(shiftRepository.save(shift));
    }

    public void delete(String id, String tenantId) {
        Shift shift = shiftRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        shiftRepository.delete(shift);
    }

    private ShiftDTO toDTO(Shift shift) {
        return ShiftDTO.builder()
                .id(shift.getId())
                .name(shift.getName())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .gracePeriodMinutes(shift.getGracePeriodMinutes())
                .isActive(shift.getIsActive())
                .build();
    }
}
