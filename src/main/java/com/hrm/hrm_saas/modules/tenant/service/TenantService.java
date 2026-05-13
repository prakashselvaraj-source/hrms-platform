package com.hrm.hrm_saas.modules.tenant.service;

import com.hrm.hrm_saas.modules.location.dto.WorkLocationDTO;
import com.hrm.hrm_saas.modules.location.entity.WorkLocation;
import com.hrm.hrm_saas.modules.location.repository.WorkLocationRepository;
import com.hrm.hrm_saas.modules.location.service.WorkLocationService;
import com.hrm.hrm_saas.modules.shift.dto.ShiftDTO;
import com.hrm.hrm_saas.modules.shift.entity.Shift;
import com.hrm.hrm_saas.modules.shift.repository.ShiftRepository;
import com.hrm.hrm_saas.modules.shift.service.ShiftService;
import com.hrm.hrm_saas.modules.tenant.dto.OrganizationSetupDTO;
import com.hrm.hrm_saas.modules.tenant.dto.TenantFullDetailsDTO;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {
    private final TenantRepository tenantRepository;
    private final WorkLocationRepository workLocationRepository;
    private final ShiftRepository shiftRepository;
    private final WorkLocationService workLocationService;
    private final ShiftService shiftService;

    @Transactional
    public Tenant completeOrganizationSetup(String companyCode, OrganizationSetupDTO dto) {
        Tenant tenant = tenantRepository.findByCompanyCode(companyCode)
                .orElseThrow(() -> new RuntimeException("Tenant not found with code: " + companyCode));

        // Update Tenant Info
        tenant.setCompanyName(dto.getCompanyName());
        tenant.setIndustry(dto.getIndustry());
        tenant.setCompanySize(dto.getCompanySize());
        tenant.setBusinessEmail(dto.getBusinessEmail());
        tenant.setPhoneNumber(dto.getPhoneNumber());
        tenant.setCountry(dto.getCountry());
        tenant.setTimezone(dto.getTimezone());
        tenant.setWebsite(dto.getWebsite());
        tenant.setRegistrationNumber(dto.getRegistrationNumber());
        tenant.setLogoUrl(dto.getLogoUrl());
        tenant.setSelectedPlan(dto.getSelectedPlan());
        tenant.setEnabledModules(dto.getEnabledModules());
        tenant.setSetupComplete(true);

        // 1. Clear Existing Data for this Tenant to avoid duplicates on update
        workLocationRepository.deleteByTenantId(companyCode);
        shiftRepository.deleteByTenantId(companyCode);

        // 2. Save New Locations
        if (dto.getLocations() != null) {
            dto.getLocations().forEach(locDto -> {
                WorkLocation location = new WorkLocation();
                location.setName(locDto.getName());
                location.setAddress(locDto.getAddress());
                location.setCity(locDto.getCity());
                location.setState(locDto.getState());
                location.setCountry(locDto.getCountry());
                location.setZipCode(locDto.getZipCode());
                location.setTenantId(companyCode);
                location.setIsActive(true);
                workLocationRepository.save(location);
            });
        }

        // 3. Save New Shifts
        if (dto.getShifts() != null) {
            dto.getShifts().forEach(shiftDto -> {
                Shift shift = new Shift();
                shift.setName(shiftDto.getName());
                shift.setStartTime(shiftDto.getStartTime());
                shift.setEndTime(shiftDto.getEndTime());
                shift.setGracePeriodMinutes(shiftDto.getGracePeriodMinutes());
                shift.setTenantId(companyCode);
                shift.setIsActive(true);
                shiftRepository.save(shift);
            });
        }

        return tenantRepository.save(tenant);
    }

    /**
     * Returns the complete organization setup data for a tenant in a single call.
     * Aggregates: tenant fields + work locations + shifts.
     * Used by GET /api/tenants/full-details to hydrate the entire Setup Wizard in one request.
     */
    public TenantFullDetailsDTO getFullDetails(String companyCode) {
        Tenant tenant = tenantRepository.findByCompanyCode(companyCode)
                .orElseThrow(() -> new RuntimeException("Tenant not found: " + companyCode));

        List<WorkLocationDTO> locations = workLocationService.getAll(companyCode);
        List<ShiftDTO> shifts = shiftService.getAll(companyCode);

        return TenantFullDetailsDTO.builder()
                .id(tenant.getId())
                .companyCode(tenant.getCompanyCode())
                .setupComplete(tenant.isSetupComplete())
                .companyName(tenant.getCompanyName())
                .industry(tenant.getIndustry())
                .companySize(tenant.getCompanySize())
                .businessEmail(tenant.getBusinessEmail())
                .phoneNumber(tenant.getPhoneNumber())
                .country(tenant.getCountry())
                .timezone(tenant.getTimezone())
                .website(tenant.getWebsite())
                .registrationNumber(tenant.getRegistrationNumber())
                .logoUrl(tenant.getLogoUrl())
                .selectedPlan(tenant.getSelectedPlan())
                .locations(locations)
                .shifts(shifts)
                .enabledModules(tenant.getEnabledModules())
                .build();
    }
}
