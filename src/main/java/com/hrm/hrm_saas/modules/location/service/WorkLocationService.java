package com.hrm.hrm_saas.modules.location.service;

import com.hrm.hrm_saas.modules.location.dto.WorkLocationDTO;
import com.hrm.hrm_saas.modules.location.entity.WorkLocation;
import com.hrm.hrm_saas.modules.location.repository.WorkLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkLocationService {
    private final WorkLocationRepository workLocationRepository;

    public WorkLocationDTO create(String tenantId, WorkLocationDTO dto) {
        WorkLocation location = WorkLocation.builder()
                .tenantId(tenantId)
                .name(dto.getName())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .country(dto.getCountry())
                .zipCode(dto.getZipCode())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toDTO(workLocationRepository.save(location));
    }

    public List<WorkLocationDTO> getAll(String tenantId) {
        return workLocationRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public WorkLocationDTO getById(String id, String tenantId) {
        return workLocationRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Work location not found"));
    }

    public WorkLocationDTO update(String id, String tenantId, WorkLocationDTO dto) {
        WorkLocation location = workLocationRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Work location not found"));

        location.setName(dto.getName());
        location.setAddress(dto.getAddress());
        location.setCity(dto.getCity());
        location.setState(dto.getState());
        location.setCountry(dto.getCountry());
        location.setZipCode(dto.getZipCode());
        location.setIsActive(dto.getIsActive());

        return toDTO(workLocationRepository.save(location));
    }

    public void delete(String id, String tenantId) {
        WorkLocation location = workLocationRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Work location not found"));
        workLocationRepository.delete(location);
    }

    private WorkLocationDTO toDTO(WorkLocation location) {
        return WorkLocationDTO.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .city(location.getCity())
                .state(location.getState())
                .country(location.getCountry())
                .zipCode(location.getZipCode())
                .isActive(location.getIsActive())
                .build();
    }
}
