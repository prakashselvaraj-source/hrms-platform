package com.hrm.hrm_saas.modules.holiday.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrm.hrm_saas.modules.holiday.model.Holiday;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByTenantId(Long tenantId, Sort sort);
    Optional<Holiday> findByIdAndTenantId(Long id, Long tenantId);
}