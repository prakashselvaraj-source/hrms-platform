package com.hrm.hrm_saas.modules.leave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hrm.hrm_saas.modules.leave.entity.Leave;

public interface LeaveRepository extends JpaRepository<Leave, String> {
}