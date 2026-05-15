package com.hrm.hrm_saas.modules.task.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.task.dto.TaskRequestDto;
import com.hrm.hrm_saas.modules.task.dto.TaskResponseDto;
import com.hrm.hrm_saas.modules.task.entity.Task;
import com.hrm.hrm_saas.modules.task.enums.TaskStatus;
import com.hrm.hrm_saas.modules.task.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

        private final TaskRepository taskRepository;
        private final EmployeeRepository employeeRepository;

        public TaskResponseDto assignTask(
                        String tenantId,
                        String assignedByEmail,
                        TaskRequestDto dto) {

                System.out.println("Assign Task : " + tenantId + " " + assignedByEmail + " " + dto);

                Employee assignedBy = employeeRepository
                                .findFirstByTenant_CompanyNameAndWorkEmail(
                                                tenantId,
                                                assignedByEmail)
                                .orElse(null);

                if (assignedBy == null) {
                        throw new RuntimeException("Assigned by employee not found");
                }

                Employee assignedTo = employeeRepository
                                .findById(dto.getAssignedToId())
                                .orElseThrow(() -> new RuntimeException("Assigned to employee not found"));

                Task task = Task.builder()
                                .tenantId(tenantId)
                                .title(dto.getTitle())
                                .description(dto.getDescription())
                                .priority(dto.getPriority())
                                .status(TaskStatus.PENDING)
                                .dueDate(dto.getDueDate())
                                .assignedBy(assignedBy)
                                .assignedTo(assignedTo)
                                .build();

                Task savedTask = taskRepository.save(task);

                return mapToDto(savedTask);
        }

        public List<TaskResponseDto> getMyTasks(
                        String tenantId,
                        String email) {

                System.out.println("Get My Tasks : " + tenantId + " " + email);
                return taskRepository
                                .findByTenantIdAndAssignedTo_WorkEmailOrderByCreatedAtDesc(
                                                tenantId,
                                                email)
                                .stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        private TaskResponseDto mapToDto(Task task) {

                return TaskResponseDto.builder()
                                .id(task.getId())
                                .title(task.getTitle())
                                .description(task.getDescription())
                                .priority(task.getPriority())
                                .status(task.getStatus())
                                .dueDate(task.getDueDate())
                                .assignedTo(
                                                task.getAssignedTo().getFirstName() + " "
                                                                + task.getAssignedTo().getLastName())
                                .assignedBy(
                                                task.getAssignedBy().getFirstName() + " "
                                                                + task.getAssignedBy().getLastName())
                                .createdAt(task.getCreatedAt())
                                .build();
        }
}