package com.hrm.hrm_saas.modules.task.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.hrm_saas.modules.task.enums.TaskPriority;
import com.hrm.hrm_saas.modules.task.enums.TaskStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponseDto {

    private Long id;

    private String title;

    private String description;

    private TaskPriority priority;

    private TaskStatus status;

    private LocalDate dueDate;

    private String assignedTo;

    private String assignedBy;

    private LocalDateTime createdAt;

}
