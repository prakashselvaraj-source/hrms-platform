package com.hrm.hrm_saas.modules.task.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hrm.hrm_saas.modules.task.dto.TaskRequestDto;
import com.hrm.hrm_saas.modules.task.service.TaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

        private final TaskService taskService;

        @PostMapping("/{tenantId}/assign")
        public ResponseEntity<?> assignTask(
                        @PathVariable String tenantId,
                        @RequestBody TaskRequestDto dto,
                        Authentication authentication) {

                String email = authentication.getName();

                return ResponseEntity.ok(
                                taskService.assignTask(
                                                tenantId,
                                                email,
                                                dto));
        }

        @GetMapping("/{tenantId}/my-tasks")
        public ResponseEntity<?> getMyTasks(
                        @PathVariable String tenantId,
                        Authentication authentication) {

                String email = authentication.getName();

                System.out.println("email " + email);
                return ResponseEntity.ok(
                                taskService.getMyTasks(
                                                tenantId,
                                                email));

        }
}