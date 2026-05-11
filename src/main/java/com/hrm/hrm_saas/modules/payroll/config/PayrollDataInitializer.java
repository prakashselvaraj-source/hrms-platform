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
        if (payslipRepository.count() > 0) {
            log.info("Payroll data already exists, skipping seed (count={})", payslipRepository.count());
            return;
        }

        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            log.warn("No employees found, cannot seed payroll data");
            return;
        }

        log.info("Seeding payroll data for {} employees...", employees.size());

        String[] months = { "January 2026", "February 2026", "March 2026" };
        LocalDate[] payDates = { LocalDate.of(2026, 1, 31), LocalDate.of(2026, 2, 28), LocalDate.of(2026, 3, 31) };

        for (Employee employee : employees) {
            String tenantId = employee.getTenant() != null ? employee.getTenant().getCompanyName() : "default";

            for (int i = 0; i < months.length; i++) {
                double monthlyGross = employee.getMonthlyGross() != null ? employee.getMonthlyGross() : 50000.0;

                Payslip payslip = Payslip.builder()
                        .tenantId(tenantId)
                        .employee(employee)
                        .month(months[i])
                        .startDate(payDates[i].withDayOfMonth(1))
                        .endDate(payDates[i])
                        .paymentDate(payDates[i])
                        .grossEarnings(BigDecimal.valueOf(monthlyGross))
                        .totalDeductions(BigDecimal.valueOf(monthlyGross * 0.1))
                        .netSalary(BigDecimal.valueOf(monthlyGross * 0.9))
                        .status(PayslipStatus.PAID)
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
            }
        }

        log.info("Payroll data seeded successfully");
    }
}
