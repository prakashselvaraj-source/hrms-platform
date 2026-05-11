package com.hrm.hrm_saas.modules.holiday.repository;

import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrm.hrm_saas.modules.holiday.model.Holiday;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    Page<Holiday> findByTenantCompanyName(String companyName, Pageable pageable);

    Optional<Holiday> findByIdAndTenantCompanyName(Long id, String companyName);

    Page<Holiday> findByTenantCompanyNameAndDateGreaterThanEqual(String tenantId, LocalDate today, Pageable pageable);
}