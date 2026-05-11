package com.hrm.hrm_saas.modules.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.hrm_saas.modules.task.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTenantIdOrderByCreatedAtDesc(String tenantId);

    List<Task> findByTenantIdAndAssignedTo_WorkEmailOrderByCreatedAtDesc(
            String tenantId,
            String email);
}