package com.hrm.hrm_saas.modules.designation.service;

import com.hrm.hrm_saas.modules.designation.dto.DesignationDTO;
import com.hrm.hrm_saas.modules.designation.entity.Designation;
import com.hrm.hrm_saas.modules.designation.repository.DesignationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DesignationService {
    private final DesignationRepository designationRepository;

    public DesignationDTO create(String tenantId, DesignationDTO dto) {
        Designation designation = Designation.builder()
                .tenantId(tenantId)
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toDTO(designationRepository.save(designation));
    }

    public List<DesignationDTO> getAll(String tenantId) {
        return designationRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DesignationDTO getById(String id, String tenantId) {
        return designationRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Designation not found"));
    }

    public DesignationDTO update(String id, String tenantId, DesignationDTO dto) {
        Designation designation = designationRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Designation not found"));

        designation.setName(dto.getName());
        designation.setCode(dto.getCode());
        designation.setDescription(dto.getDescription());
        designation.setIsActive(dto.getIsActive());

        return toDTO(designationRepository.save(designation));
    }

    public void delete(String id, String tenantId) {
        Designation designation = designationRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Designation not found"));
        designationRepository.delete(designation);
    }

    private DesignationDTO toDTO(Designation designation) {
        return DesignationDTO.builder()
                .id(designation.getId())
                .name(designation.getName())
                .code(designation.getCode())
                .description(designation.getDescription())
                .isActive(designation.getIsActive())
                .build();
    }
}
