package com.hrm.hrm_saas.modules.task.dto;

import java.time.LocalDate;

import com.hrm.hrm_saas.modules.task.enums.TaskPriority;

import lombok.Data;

@Data
public class TaskRequestDto {

    private String title;

    private String description;

    private TaskPriority priority;

    private LocalDate dueDate;

    private Long assignedToId;

}
