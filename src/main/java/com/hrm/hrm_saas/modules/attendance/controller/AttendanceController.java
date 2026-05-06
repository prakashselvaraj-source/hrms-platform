package com.hrm.hrm_saas.modules.attendance.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.hrm_saas.modules.attendance.service.AttendanceService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService service;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(HttpServletRequest request) {

        String tenantId = (String) request.getAttribute("tenantId");
        String employeeId = (String) request.getAttribute("userId");

        service.checkIn(employeeId, tenantId);

        return ResponseEntity.ok("check-in successful");
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(HttpServletRequest request) {

        String tenantId = (String) request.getAttribute("tenantId");
        String employeeId = (String) request.getAttribute("userId");

        service.checkOut(employeeId, tenantId);

        return ResponseEntity.ok("check-out successful");
    }

    @GetMapping
    public ResponseEntity<?> getMyAttendance(Pageable pageable, HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        String employeeId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(service.getEmployeeAttendance(employeeId, tenantId, pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpServletRequest request) {
        String tenantId = (String) request.getAttribute("tenantId");
        String employeeId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(service.getStats(employeeId, tenantId));
    }
}
