package com.hrm.hrm_saas.modules.resignation.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.resignation.model.Resignation;
import com.hrm.hrm_saas.modules.resignation.model.ResignationDTO;
import com.hrm.hrm_saas.modules.resignation.model.ResignationResponseDTO;
import com.hrm.hrm_saas.modules.resignation.repository.ResignationRepository;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.resignation.model.ResignationPageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResignationService {

    private final ResignationRepository resignationRepository;
    private final EmployeeRepository employeeRepository;
    private final TenantRepository tenantRepository;

    public ResignationDTO create(ResignationDTO dto, String email) {
        Tenant tenant = tenantRepository.findByCompanyName(dto.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found"));

        Employee employee = employeeRepository.findFirstByWorkEmailAndTenant(email, tenant)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for email: " + email));

        dto.setEmployeeId(employee.getId());

        Resignation resignation = mapToEntity(dto);
        resignation.setStatus("PENDING");
        return mapToDTO(resignationRepository.save(resignation));
    }

    public ResignationPageResponse getAllForTenant(String tenantId, Pageable pageable) {
        Page<Resignation> page = resignationRepository.findByTenantId(tenantId, pageable);
        List<ResignationResponseDTO> resignations = page.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        return new ResignationPageResponse(resignations, page.getNumber(), page.getTotalPages(),
                page.getTotalElements());
    }

    public ResignationPageResponse getByEmployeeId(Long employeeId, String tenantId, Pageable pageable) {
        Page<Resignation> page = resignationRepository.findByEmployeeIdAndTenantId(employeeId, tenantId, pageable);
        List<ResignationResponseDTO> resignations = page.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        return new ResignationPageResponse(resignations, page.getNumber(), page.getTotalPages(),
                page.getTotalElements());
    }

    public ResignationPageResponse getByEmployeeEmail(String email, String tenantId, Pageable pageable) {
        Tenant tenant = tenantRepository.findByCompanyName(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found"));

        Employee employee = employeeRepository.findFirstByWorkEmailAndTenant(email, tenant)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for email: " + email));

        return getByEmployeeId(employee.getId(), tenantId, pageable);
    }

    public ResignationDTO updateStatus(Long id, String status, String tenantId) {
        Resignation resignation = resignationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resignation not found"));
        if (!resignation.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Resignation does not belong to the current tenant");
        }
        resignation.setStatus(status);
        return mapToDTO(resignationRepository.save(resignation));
    }

    public void delete(Long id) {
        resignationRepository.deleteById(id);
    }

    public ResignationResponseDTO getById(Long id, String tenantId) {
        Resignation resignation = resignationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resignation not found"));
        if (!resignation.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Resignation does not belong to the current tenant");
        }
        return mapToResponseDTO(resignation);
    }

    private Resignation mapToEntity(ResignationDTO dto) {
        return Resignation.builder()
                .tenantId(dto.getTenantId())
                .employeeId(dto.getEmployeeId())
                .resignationDate(dto.getResignationDate())
                .lastWorkingDay(dto.getLastWorkingDay())
                .reason(dto.getReason())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .documentUrl(dto.getDocumentUrl())
                .build();
    }

    private ResignationDTO mapToDTO(Resignation entity) {
        return ResignationDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .employeeId(entity.getEmployeeId())
                .resignationDate(entity.getResignationDate())
                .lastWorkingDay(entity.getLastWorkingDay())
                .reason(entity.getReason())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .documentUrl(entity.getDocumentUrl())
                .build();
    }

    private ResignationResponseDTO mapToResponseDTO(Resignation entity) {
        String employeeName = employeeRepository.findById(entity.getEmployeeId())
                .map(Employee::getFirstName) // Assuming firstName exists, maybe concat with lastName
                .orElse("Unknown Employee");

        return ResignationResponseDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployeeId())
                .employeeName(employeeName)
                .resignationDate(entity.getResignationDate())
                .lastWorkingDay(entity.getLastWorkingDay())
                .reason(entity.getReason())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .documentUrl(entity.getDocumentUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
