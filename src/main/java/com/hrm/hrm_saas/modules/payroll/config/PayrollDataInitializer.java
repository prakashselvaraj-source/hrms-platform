package com.hrm.hrm_saas.modules.payroll.config;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.payroll.entity.Payslip;
import com.hrm.hrm_saas.modules.payroll.entity.SalaryComponent;
import com.hrm.hrm_saas.modules.payroll.enums.ComponentType;
import com.hrm.hrm_saas.modules.payroll.enums.PayslipStatus;
import com.hrm.hrm_saas.modules.payroll.repository.PayslipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PayrollDataInitializer implements ApplicationRunner {

    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            log.warn("No employees found, cannot seed payroll data");
            return;
        }

        log.info("Checking/Seeding payroll data for {} employees...", employees.size());

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonthValue = now.getMonthValue();

        for (Employee employee : employees) {
            String tenantId = employee.getTenant() != null ? employee.getTenant().getCompanyName() : "default";

            for (int m = 1; m <= currentMonthValue; m++) {
                String monthLabel = java.time.Month.of(m).name();
                String monthYear = monthLabel.substring(0, 1) + monthLabel.substring(1).toLowerCase() + " " + currentYear;
                
                // Check if already exists for this employee and month (case-insensitive)
                boolean exists = payslipRepository.findByTenantId(tenantId).stream()
                        .anyMatch(p -> p.getEmployee().getId().equals(employee.getId()) && 
                                     p.getMonth() != null && 
                                     (p.getMonth().equalsIgnoreCase(monthYear)));
                
                if (exists) continue;

                LocalDate payDate = LocalDate.of(currentYear, m, java.time.Month.of(m).length(now.isLeapYear()));
                double monthlyGross = employee.getMonthlyGross() != null ? employee.getMonthlyGross() : 50000.0;

                Payslip payslip = Payslip.builder()
                        .tenantId(tenantId)
                        .employee(employee)
                        .month(monthYear)
                        .startDate(LocalDate.of(currentYear, m, 1))
                        .endDate(payDate)
                        .paymentDate(payDate)
                        .grossEarnings(BigDecimal.valueOf(monthlyGross))
                        .totalDeductions(BigDecimal.valueOf(monthlyGross * 0.1))
                        .netSalary(BigDecimal.valueOf(monthlyGross * 0.9))
                        .status(m < currentMonthValue ? PayslipStatus.PAID : PayslipStatus.DRAFT)
                        .build();

                List<SalaryComponent> components = new ArrayList<>();
                components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING,
                        BigDecimal.valueOf(monthlyGross * 0.5)));
                components.add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING,
                        BigDecimal.valueOf(monthlyGross * 0.3)));
                components.add(new SalaryComponent(null, payslip, "Special Allowance", ComponentType.EARNING,
                        BigDecimal.valueOf(monthlyGross * 0.2)));
                components.add(new SalaryComponent(null, payslip, "Income Tax", ComponentType.DEDUCTION,
                        BigDecimal.valueOf(monthlyGross * 0.05)));
                components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION,
                        BigDecimal.valueOf(monthlyGross * 0.05)));

                payslip.setComponents(components);
                payslipRepository.save(payslip);
                log.info("Generated missing payroll record for {} - {}", employee.getFirstName(), monthYear);
            }
        }

        log.info("Payroll data check/seed completed");
    }
}
