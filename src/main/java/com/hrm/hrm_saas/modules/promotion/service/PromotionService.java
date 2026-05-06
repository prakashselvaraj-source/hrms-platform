package com.hrm.hrm_saas.modules.promotion.service;

import com.hrm.hrm_saas.modules.promotion.model.Promotion;
import com.hrm.hrm_saas.modules.promotion.model.PromotionDTO;
import com.hrm.hrm_saas.modules.promotion.repository.PromotionRepository;
import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final EmployeeRepository employeeRepository;
    private final TenantRepository tenantRepository;

    public PromotionDTO create(PromotionDTO dto) {
        Tenant tenant = tenantRepository.findByCompanyName(dto.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found"));

        Employee employee = employeeRepository.findByIdAndTenantId(dto.getEmployeeId(), dto.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        // Calculate and set CTC values
        Long prevCTC = dto.getAnnualCtc();
        Long adjustment = dto.getSalaryAdjustment() != null ? dto.getSalaryAdjustment() : 0L;
        Long currentCTC = (prevCTC != null ? prevCTC : 0L) + adjustment;

        dto.setPrevAnnualCTC(prevCTC);
        dto.setCurrentAnnualCTC(currentCTC);

        // Update Employee record
        employee.setDesignation(dto.getNewDesignation());
        if (currentCTC > 0) {
            employee.setAnnualCtc(currentCTC.doubleValue());
        }
        employeeRepository.save(employee);

        Promotion promotion = mapToEntity(dto);
        return mapToDTO(promotionRepository.save(promotion));
    }

    public List<PromotionDTO> getAll(String tenantId) {
        return promotionRepository.findByTenantId(tenantId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PromotionDTO getById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promotion not found"));
        return mapToDTO(promotion);
    }

    public PromotionDTO update(Long id, PromotionDTO dto) {
        Promotion existing = promotionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promotion not found"));

        if (dto.getEmployeeId() != null) {
            existing.setEmployeeId(dto.getEmployeeId());
        }

        existing.setPreviousDesignation(dto.getPreviousDesignation());
        existing.setNewDesignation(dto.getNewDesignation());
        existing.setPromotionDate(dto.getPromotionDate());

        Long prevCTC = dto.getAnnualCtc() != null ? dto.getAnnualCtc() : existing.getPrevAnnualCTC();
        Long adjustment = dto.getSalaryAdjustment() != null ? dto.getSalaryAdjustment()
                : existing.getSalaryAdjustment();
        Long currentCTC = (prevCTC != null ? prevCTC : 0L) + (adjustment != null ? adjustment : 0L);

        existing.setPrevAnnualCTC(prevCTC);
        existing.setSalaryAdjustment(adjustment);
        existing.setCurrentAnnualCTC(currentCTC);

        existing.setStatus(dto.getStatus());
        existing.setPromotionLetterUrl(dto.getPromotionLetterUrl());
        existing.setReason(dto.getReason());

        // Also update the Employee record to reflect these changes
        Long empId = existing.getEmployeeId();
        String tId = existing.getTenantId();

        // Note: Using a simpler lookup if we don't have the full Tenant object here,
        // or we can fetch the tenant first.
        employeeRepository.findById(empId).ifPresent(emp -> {
            emp.setDesignation(existing.getNewDesignation());
            if (existing.getCurrentAnnualCTC() != null && existing.getCurrentAnnualCTC() > 0) {
                emp.setAnnualCtc(existing.getCurrentAnnualCTC().doubleValue());
            }
            employeeRepository.save(emp);
        });

        return mapToDTO(promotionRepository.save(existing));
    }

    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }

    private Promotion mapToEntity(PromotionDTO dto) {

        return Promotion.builder()
                .employeeId(dto.getEmployeeId())
                .previousDesignation(dto.getPreviousDesignation())
                .newDesignation(dto.getNewDesignation())
                .promotionDate(dto.getPromotionDate())
                .prevAnnualCTC(dto.getPrevAnnualCTC())
                .currentAnnualCTC(dto.getCurrentAnnualCTC())
                .salaryAdjustment(dto.getSalaryAdjustment())
                .status(dto.getStatus())
                .promotionLetterUrl(dto.getPromotionLetterUrl())
                .reason(dto.getReason())
                .tenantId(dto.getTenantId())
                .build();
    }

    private PromotionDTO mapToDTO(Promotion entity) {
        return PromotionDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployeeId())
                .previousDesignation(entity.getPreviousDesignation())
                .newDesignation(entity.getNewDesignation())
                .promotionDate(entity.getPromotionDate())
                .prevAnnualCTC(entity.getPrevAnnualCTC())
                .currentAnnualCTC(entity.getCurrentAnnualCTC())
                .salaryAdjustment(entity.getSalaryAdjustment())
                .status(entity.getStatus())
                .promotionLetterUrl(entity.getPromotionLetterUrl())
                .reason(entity.getReason())
                .tenantId(entity.getTenantId())
                .build();
    }
}