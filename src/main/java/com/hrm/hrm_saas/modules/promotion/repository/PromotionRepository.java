package com.hrm.hrm_saas.modules.promotion.repository;

import com.hrm.hrm_saas.modules.promotion.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    List<Promotion> findByTenantId(String tenantId);
}