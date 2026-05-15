package com.hrm.hrm_saas.modules.payroll.service;

import com.hrm.hrm_saas.modules.employee.model.Employee;
import com.hrm.hrm_saas.modules.employee.repository.EmployeeRepository;
import com.hrm.hrm_saas.modules.payroll.dto.BankDetailsDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.dto.PayslipResponseDTO;
import com.hrm.hrm_saas.modules.payroll.entity.BankDetails;
import com.hrm.hrm_saas.modules.payroll.entity.Payslip;
import com.hrm.hrm_saas.modules.payroll.entity.SalaryComponent;
import com.hrm.hrm_saas.modules.payroll.enums.ComponentType;
import com.hrm.hrm_saas.modules.payroll.enums.PayslipStatus;
import com.hrm.hrm_saas.modules.payroll.dto.AdminPayrollOverviewDTO;
import com.hrm.hrm_saas.modules.payroll.entity.PayrollPolicy;
import com.hrm.hrm_saas.modules.payroll.repository.BankDetailsRepository;
import com.hrm.hrm_saas.modules.payroll.repository.PayrollPolicyRepository;
import com.hrm.hrm_saas.modules.payroll.repository.PayslipRepository;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.tenant.repository.TenantRepository;
import com.hrm.hrm_saas.modules.user.entity.User;
import com.hrm.hrm_saas.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayslipRepository payslipRepository;
    private final BankDetailsRepository bankDetailsRepository;
    private final EmployeeRepository employeeRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PayrollPolicyRepository payrollPolicyRepository;
    private final com.hrm.hrm_saas.modules.payroll.repository.SalaryStructureRepository salaryStructureRepository;

    @Override
    public PayrollOverviewDTO getOverview(String tenantId, String email) {
        System.out.println("PayrollServiceImpl.getOverview: tenantId=" + tenantId + ", email=" + email);
        Employee employee = getEmployeeByEmail(email, tenantId);

        if (employee == null) {
            return PayrollOverviewDTO.builder()
                    .netTakeHome(BigDecimal.ZERO)
                    .ytdEarnings(BigDecimal.ZERO)
                    .ytdTax(BigDecimal.ZERO)
                    .nextPayDay("Not Set")
                    .bankName("Not Set")
                    .accountLastFour("****")
                    .build();
        }

        System.out.println("DEBUG: Fetching payslips for employeeId=" + employee.getId() + " and tenantId=" + tenantId);
        List<Payslip> allPayslips = payslipRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId);
        System.out.println("DEBUG: Found " + allPayslips.size() + " payslips.");

        BigDecimal ytdEarnings = allPayslips.stream()
                .filter(p -> p.getPaymentDate() != null && p.getPaymentDate().getYear() == LocalDate.now().getYear())
                .filter(p -> p.getStatus() == PayslipStatus.PAID || p.getStatus() == PayslipStatus.PROCESSED)
                .map(p -> p.getGrossEarnings() != null ? p.getGrossEarnings() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ytdTax = allPayslips.stream()
                .filter(p -> p.getPaymentDate() != null && p.getPaymentDate().getYear() == LocalDate.now().getYear())
                .map(p -> {
                    if (p.getComponents() == null)
                        return BigDecimal.ZERO;
                    return p.getComponents().stream()
                            .filter(c -> c.getType() == ComponentType.DEDUCTION && c.getName() != null
                                    && c.getName().toLowerCase().contains("tax"))
                            .map(c -> c.getAmount() != null ? c.getAmount() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Payslip latestPayslip = allPayslips.stream()
                .filter(p -> p.getStatus() == PayslipStatus.PAID || p.getStatus() == PayslipStatus.PROCESSED)
                .filter(p -> p.getPaymentDate() != null)
                .max((p1, p2) -> p1.getPaymentDate().compareTo(p2.getPaymentDate()))
                .orElse(null);

        BankDetails bankDetails = bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId)
                .orElse(null);

        String bankName = bankDetails != null ? bankDetails.getBankName()
                : (employee.getBankName() != null ? employee.getBankName() : "Not Set");
        String accNum = bankDetails != null ? bankDetails.getAccountNumber()
                : (employee.getAccountNumber() != null ? employee.getAccountNumber() : "");
        String lastFour = (accNum != null && accNum.length() > 4) ? accNum.substring(accNum.length() - 4) : "****";

        return PayrollOverviewDTO.builder()
                .netTakeHome(
                        latestPayslip != null && latestPayslip.getNetSalary() != null ? latestPayslip.getNetSalary()
                                : BigDecimal.ZERO)
                .ytdEarnings(ytdEarnings)
                .ytdTax(ytdTax)
                .nextPayDay("Scheduled")
                .bankName(bankName)
                .accountLastFour(lastFour)
                .build();
    }

    @Override
    public Page<PayslipResponseDTO> getPayslips(String tenantId, String email, Pageable pageable) {
        if (email == null || email.trim().isEmpty()) {
            Page<Payslip> payslips = payslipRepository.findByTenantIdOrderByPaymentDateDesc(tenantId, pageable);
            return payslips.map(this::convertToResponseDTO);
        }
        Employee employee = getEmployeeByEmail(email, tenantId);
        if (employee == null)
            return Page.empty(pageable);
        Page<Payslip> payslips = payslipRepository.findByEmployeeIdAndTenantIdOrderByPaymentDateDesc(employee.getId(),
                tenantId, pageable);
        return payslips.map(this::convertToResponseDTO);
    }

    @Override
    public BankDetailsDTO getBankDetails(String tenantId, String email) {
        System.out.println("PayrollServiceImpl.getBankDetails: tenantId=" + tenantId + ", email=" + email);
        Employee employee = getEmployeeByEmail(email, tenantId);
        if (employee == null)
            return new BankDetailsDTO();

        BankDetails bankDetails = bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId)
                .orElse(null);

        if (bankDetails == null) {
            System.out.println("No separate bank details found, using employee profile fields");
            return BankDetailsDTO.builder()
                    .accountHolderName(employee.getAccountHolderName())
                    .bankName(employee.getBankName())
                    .accountNumber(employee.getAccountNumber())
                    .ifscCode(employee.getIfscSwiftCode())
                    .build();
        }

        return convertToBankDTO(bankDetails);
    }

    @Override
    @Transactional
    public BankDetailsDTO updateBankDetails(String tenantId, String email, BankDetailsDTO dto) {
        System.out.println("PayrollServiceImpl.updateBankDetails: tenantId=" + tenantId + ", email=" + email);
        Employee employee = getEmployeeByEmail(email, tenantId);
        if (employee == null)
            throw new RuntimeException("Cannot update bank details: Employee profile not found");

        BankDetails bankDetails = bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId)
                .orElse(new BankDetails());

        bankDetails.setEmployee(employee);
        bankDetails.setTenantId(tenantId);
        bankDetails.setAccountHolderName(dto.getAccountHolderName());
        bankDetails.setBankName(dto.getBankName());
        bankDetails.setAccountNumber(dto.getAccountNumber());
        bankDetails.setIfscCode(dto.getIfscCode());
        bankDetails.setBranchName(dto.getBranchName());
        bankDetails.setAccountType(dto.getAccountType());

        bankDetails = bankDetailsRepository.save(bankDetails);

        // Sync back to employee entity for consistency
        employee.setAccountHolderName(dto.getAccountHolderName());
        employee.setBankName(dto.getBankName());
        employee.setAccountNumber(dto.getAccountNumber());
        employee.setIfscSwiftCode(dto.getIfscCode());
        employeeRepository.save(employee);

        return convertToBankDTO(bankDetails);
    }

    @Override
    public Object getSalaryStructure(String tenantId, String email) {
        Employee employee = getEmployeeByEmail(email, tenantId);
        return java.util.Map.of(
                "annualCtc", employee.getAnnualCtc(),
                "monthlyGross", employee.getMonthlyGross(),
                "basicSalary", employee.getBasicSalary(),
                "performanceBonus", employee.getPerformanceBonus(),
                "professionalTax", employee.getProfessionalTax());
    }

    @Override
    public byte[] downloadPayslip(String tenantId, String payslipId) {
        // Mocking PDF download for now
        return "Dummy PDF Content".getBytes();
    }

    private Employee getEmployeeByEmail(String email, String tenantId) {
        String trimmedEmail = email != null ? email.trim() : "";
        String trimmedTenantId = tenantId != null ? tenantId.trim() : "";

        System.out.println("Payroll lookup: email=[" + trimmedEmail + "], tenantId=[" + trimmedTenantId + "]");

        // 1. Try finding by Tenant object
        Optional<Tenant> tenantOpt = tenantRepository.findByCompanyName(trimmedTenantId);
        if (!tenantOpt.isPresent()) {
            tenantOpt = tenantRepository.findByCompanyCode(trimmedTenantId);
        }

        if (tenantOpt.isPresent()) {
            Optional<Employee> emp = employeeRepository.findFirstByWorkEmailAndTenant(trimmedEmail, tenantOpt.get());
            if (emp.isPresent())
                return emp.get();

            emp = employeeRepository.findFirstByWorkEmailIgnoreCase(trimmedEmail);
            if (emp.isPresent() && emp.get().getTenant().getId().equals(tenantOpt.get().getId())) {
                return emp.get();
            }
        }

        // 2. Try lookup via User entity
        Optional<User> userOpt = userRepository.findFirstByEmail(trimmedEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getTenant() != null) {
                Optional<Employee> emp = employeeRepository.findFirstByWorkEmailAndTenant(trimmedEmail, user.getTenant());
                if (emp.isPresent())
                    return emp.get();
            }
        }

        // 3. Last resort: find by email globally
        Employee employee = employeeRepository.findFirstByWorkEmailIgnoreCase(trimmedEmail).orElse(null);
        if (employee != null)
            return employee;

        System.out.println("WARNING: Employee not found for " + trimmedEmail);
        return null; // Return null so callers can handle it gracefully
    }

    private PayslipResponseDTO convertToResponseDTO(Payslip payslip) {
        List<SalaryComponent> components = payslip.getComponents();
        if (components == null)
            components = new ArrayList<>();

        List<PayslipResponseDTO.ComponentDTO> earnings = components.stream()
                .filter(c -> c.getType() == ComponentType.EARNING)
                .map(c -> new PayslipResponseDTO.ComponentDTO(c.getName(), c.getAmount()))
                .collect(Collectors.toList());

        List<PayslipResponseDTO.ComponentDTO> deductions = components.stream()
                .filter(c -> c.getType() == ComponentType.DEDUCTION)
                .map(c -> new PayslipResponseDTO.ComponentDTO(c.getName(), c.getAmount()))
                .collect(Collectors.toList());

        String employeeName = payslip.getEmployee() != null
                ? payslip.getEmployee().getFirstName() + " " + payslip.getEmployee().getLastName()
                : "N/A";
        String employeeId = payslip.getEmployee() != null ? String.valueOf(payslip.getEmployee().getId()) : "N/A";
        String employeeDept = payslip.getEmployee() != null ? payslip.getEmployee().getDepartment() : "N/A";
        String employeeDesig = payslip.getEmployee() != null ? payslip.getEmployee().getDesignation() : "N/A";

        return PayslipResponseDTO.builder()
                .id(payslip.getId())
                .employeeId(employeeId)
                .employeeName(employeeName)
                .employeeDepartment(employeeDept)
                .employeeDesignation(employeeDesig)
                .month(payslip.getMonth())
                .period(payslip.getStartDate().format(DateTimeFormatter.ofPattern("MMM dd")) + " - " +
                        payslip.getEndDate().format(DateTimeFormatter.ofPattern("MMM dd")))
                .amount(payslip.getNetSalary())
                .status(payslip.getStatus() != null ? payslip.getStatus() : PayslipStatus.DRAFT)
                .date(payslip.getPaymentDate())
                .earnings(earnings)
                .deductions(deductions)
                .grossTotal(payslip.getGrossEarnings())
                .totalDeductions(payslip.getTotalDeductions())
                .build();
    }

    @Override
    @Transactional
    public void seedData(String tenantId, String email) {
        String trimmedEmail = email != null ? email.trim() : "";
        Employee employee;

        try {
            employee = getEmployeeByEmail(trimmedEmail, tenantId);
            if (employee == null)
                throw new RuntimeException("Employee profile not found for " + trimmedEmail);
        } catch (RuntimeException e) {
            System.out.println("Employee not found for seeding. Attempting to create from User record...");
            User user = userRepository.findFirstByEmail(trimmedEmail)
                    .orElseThrow(() -> new RuntimeException("Cannot seed: User not found for email " + trimmedEmail));

            Tenant tenant = user.getTenant();
            if (tenant == null) {
                tenant = tenantRepository.findByCompanyName(tenantId)
                        .orElseGet(() -> tenantRepository.findByCompanyCode(tenantId)
                                .orElseThrow(() -> new RuntimeException("Cannot seed: Tenant not found " + tenantId)));
            }

            employee = Employee.builder()
                    .workEmail(trimmedEmail)
                    .firstName(user.getName().split(" ")[0])
                    .lastName(user.getName().contains(" ") ? user.getName().substring(user.getName().indexOf(" ") + 1)
                            : "")
                    .tenant(tenant)
                    .dateOfBirth(LocalDate.of(1990, 1, 1))
                    .gender("Other")
                    .mobileNumber("0000000000")
                    .currentStreet("Sample Street")
                    .currentCity("Sample City")
                    .currentState("Sample State")
                    .currentZip("000000")
                    .currentCountry("Sample Country")
                    .emergencyContactName("Emergency")
                    .emergencyContactRelationship("Relative")
                    .emergencyContactMobile("0000000000")
                    .dateOfJoining(LocalDate.now().minusYears(1))
                    .reportingManager("Admin")
                    .workLocation("Remote")
                    .employmentType("Full-time")
                    .designation("Employee")
                    .department("General")
                    .accountHolderName(user.getName())
                    .bankName("Example Bank")
                    .branchName("Main")
                    .accountNumber("0000000000")
                    .ifscSwiftCode("IFSC0001234")
                    .aadharNumber("000000000000")
                    .panNumber("ABCDE1234F")
                    .disbursementMethod("Bank Transfer")
                    .annualCtc(600000.0)
                    .status(Employee.OnboardingStatus.APPROVED)
                    .build();

            employee = employeeRepository.save(employee);
            System.out.println("Created missing employee record for seeding: " + employee.getId());
        }

        // Now seed the payslips dynamically until now
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonthValue = now.getMonthValue();

        final Employee finalEmployee = employee;
        for (int m = 1; m <= currentMonthValue; m++) {
            String monthLabel = java.time.Month.of(m).name();
            String monthYear = monthLabel.substring(0, 1) + monthLabel.substring(1).toLowerCase() + " " + currentYear;

            // Skip if already exists
            if (payslipRepository.findByMonthAndTenantId(monthYear, tenantId).stream()
                    .anyMatch(p -> p.getEmployee().getId().equals(finalEmployee.getId()))) {
                continue;
            }

            LocalDate payDate = LocalDate.of(currentYear, m, java.time.Month.of(m).length(now.isLeapYear()));

            Payslip payslip = Payslip.builder()
                    .tenantId(tenantId)
                    .employee(employee)
                    .month(monthYear)
                    .startDate(LocalDate.of(currentYear, m, 1))
                    .endDate(payDate)
                    .paymentDate(payDate)
                    .grossEarnings(new BigDecimal("50000.00"))
                    .totalDeductions(new BigDecimal("5000.00"))
                    .netSalary(new BigDecimal("45000.00"))
                    .status(m < currentMonthValue ? PayslipStatus.PAID : PayslipStatus.DRAFT)
                    .build();

            List<SalaryComponent> components = new ArrayList<>();
            components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING,
                    new BigDecimal("30000.00")));
            components
                    .add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING, new BigDecimal("15000.00")));
            components.add(new SalaryComponent(null, payslip, "Special Allowance", ComponentType.EARNING,
                    new BigDecimal("5000.00")));
            components.add(new SalaryComponent(null, payslip, "Income Tax", ComponentType.DEDUCTION,
                    new BigDecimal("3000.00")));
            components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION,
                    new BigDecimal("2000.00")));

            payslip.setComponents(components);
            payslipRepository.save(payslip);
        }

        // Also seed Bank Details if missing
        if (!bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId).isPresent()) {
            BankDetails bank = BankDetails.builder()
                    .employee(employee)
                    .tenantId(tenantId)
                    .bankName("Example Bank")
                    .accountHolderName(employee.getFirstName() + " " + employee.getLastName())
                    .accountNumber("1234567890")
                    .ifscCode("EXMP0001234")
                    .branchName("Main Branch")
                    .accountType("SAVINGS")
                    .build();
            bankDetailsRepository.save(bank);
        }

        // Also seed a default Salary Structure if missing
        if (!salaryStructureRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId).isPresent()) {
            com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure structure = com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure
                    .builder()
                    .employee(employee)
                    .tenantId(tenantId)
                    .basicSalary(new BigDecimal("30000.00"))
                    .hra(new BigDecimal("10000.00"))
                    .medicalAllowance(new BigDecimal("2000.00"))
                    .travelAllowance(new BigDecimal("3000.00"))
                    .specialAllowance(new BigDecimal("5000.00"))
                    .pfContribution(new BigDecimal("3600.00"))
                    .professionalTax(new BigDecimal("200.00"))
                    .status(com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure.SalaryStructureStatus.ACTIVE)
                    .effectiveFrom(LocalDate.now().minusYears(1))
                    .build();
            salaryStructureRepository.save(structure);
        }
    }

    @Override
    @Transactional
    public AdminPayrollOverviewDTO getAdminOverview(String tenantId) {
        // Ensure all months in current year are initialized
        ensurePayrollHistoryInitialized(tenantId);

        LocalDate now = LocalDate.now();
        String monthName = now.getMonth().name();
        String currentMonthName = monthName.substring(0, 1) + monthName.substring(1).toLowerCase() + " "
                + now.getYear();

        List<Payslip> currentMonthPayslips = payslipRepository.findByMonthAndTenantId(currentMonthName, tenantId);

        // Fallback for case-insensitive match if needed
        if (currentMonthPayslips.isEmpty()) {
            currentMonthPayslips = payslipRepository.findByMonthAndTenantId(currentMonthName.toUpperCase(), tenantId);
        }

        BigDecimal totalGross = currentMonthPayslips.stream()
                .map(p -> p.getGrossEarnings() != null ? p.getGrossEarnings() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNet = currentMonthPayslips.stream()
                .map(p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeductions = currentMonthPayslips.stream()
                .map(p -> p.getTotalDeductions() != null ? p.getTotalDeductions() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalEmployees = employeeRepository.findAll().stream()
                .filter(e -> e.getTenant().getCompanyName().equalsIgnoreCase(tenantId) ||
                        e.getTenant().getCompanyCode().equalsIgnoreCase(tenantId))
                .count();

        long processedCount = currentMonthPayslips.stream()
                .filter(p -> p.getStatus() == PayslipStatus.PAID || p.getStatus() == PayslipStatus.SENT
                        || p.getStatus() == PayslipStatus.PROCESSED)
                .count();

        // Determine granular step (1 to 5)
        int step = 1;
        if (!currentMonthPayslips.isEmpty()) {
            step = 2; // Initial drafts exist
            if (processedCount > 0) {
                step = 4; // Processing in progress (matches 'Run Payroll' step in UI)
                if (processedCount == totalEmployees) {
                    step = 5; // All processed
                }
            }
        }

        return AdminPayrollOverviewDTO.builder()
                .totalPayrollCost(totalGross)
                .totalNetPayout(totalNet)
                .employeesProcessed(processedCount)
                .totalEmployees(totalEmployees)
                .totalDeductions(totalDeductions)
                .lopCases(0)
                .currentMonth(currentMonthName)
                .cycleStatus(
                        processedCount == totalEmployees ? "COMPLETED" : (processedCount > 0 ? "IN_PROGRESS" : "DRAFT"))
                .currentStep(step)
                .alerts(new ArrayList<>())
                .build();
    }

    @Transactional
    public void ensurePayrollHistoryInitialized(String tenantId) {
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonthValue = now.getMonthValue();

        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> e.getTenant().getCompanyName().equalsIgnoreCase(tenantId) ||
                        e.getTenant().getCompanyCode().equalsIgnoreCase(tenantId))
                .filter(e -> e.getStatus() == Employee.OnboardingStatus.APPROVED)
                .collect(Collectors.toList());

        for (int m = 1; m <= currentMonthValue; m++) {
            String monthLabel = java.time.Month.of(m).name();
            String monthYear = monthLabel.substring(0, 1) + monthLabel.substring(1).toLowerCase() + " " + currentYear;

            for (Employee emp : employees) {
                // Check if already exists for THIS specific employee and month
                boolean exists = payslipRepository.findByMonthAndTenantId(monthYear, tenantId).stream()
                        .anyMatch(p -> p.getEmployee() != null && p.getEmployee().getId().equals(emp.getId()));

                if (!exists) {
                    // Fallback to uppercase check for older data
                    exists = payslipRepository.findByMonthAndTenantId(monthYear.toUpperCase(), tenantId).stream()
                            .anyMatch(p -> p.getEmployee() != null && p.getEmployee().getId().equals(emp.getId()));
                }

                if (!exists) {
                    Optional<com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure> structureOpt = salaryStructureRepository
                            .findByEmployeeIdAndTenantIdAndStatus(emp.getId(), tenantId,
                                    com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure.SalaryStructureStatus.ACTIVE);

                    if (structureOpt.isPresent()) {
                        com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure s = structureOpt.get();

                        BigDecimal earnings = s.getBasicSalary()
                                .add(s.getHra() != null ? s.getHra() : BigDecimal.ZERO)
                                .add(s.getMedicalAllowance() != null ? s.getMedicalAllowance() : BigDecimal.ZERO)
                                .add(s.getTravelAllowance() != null ? s.getTravelAllowance() : BigDecimal.ZERO)
                                .add(s.getSpecialAllowance() != null ? s.getSpecialAllowance() : BigDecimal.ZERO)
                                .add(s.getPerformanceBonus() != null ? s.getPerformanceBonus() : BigDecimal.ZERO);

                        BigDecimal deductions = (s.getPfContribution() != null ? s.getPfContribution()
                                : BigDecimal.ZERO)
                                .add(s.getEsiContribution() != null ? s.getEsiContribution() : BigDecimal.ZERO)
                                .add(s.getProfessionalTax() != null ? s.getProfessionalTax() : BigDecimal.ZERO)
                                .add(s.getTds() != null ? s.getTds() : BigDecimal.ZERO)
                                .add(s.getLoanDeduction() != null ? s.getLoanDeduction() : BigDecimal.ZERO);

                        Payslip payslip = Payslip.builder()
                                .tenantId(tenantId)
                                .employee(emp)
                                .month(monthYear)
                                .startDate(LocalDate.of(currentYear, m, 1))
                                .endDate(LocalDate.of(currentYear, m, java.time.Month.of(m).length(now.isLeapYear())))
                                .paymentDate(LocalDate.of(currentYear, m, 28))
                                .grossEarnings(earnings)
                                .totalDeductions(deductions)
                                .netSalary(earnings.subtract(deductions))
                                .status(m < currentMonthValue ? PayslipStatus.PROCESSED : PayslipStatus.DRAFT)
                                .build();

                        payslipRepository.save(payslip);
                    } else {
                        // Fallback to Employee entity fields if they exist
                        BigDecimal gross = emp.getMonthlyGross() != null ? BigDecimal.valueOf(emp.getMonthlyGross())
                                : BigDecimal.ZERO;

                        if (gross.compareTo(BigDecimal.ZERO) > 0) {
                            Payslip payslip = Payslip.builder()
                                    .tenantId(tenantId)
                                    .employee(emp)
                                    .month(monthYear)
                                    .startDate(LocalDate.of(currentYear, m, 1))
                                    .endDate(LocalDate.of(currentYear, m,
                                            java.time.Month.of(m).length(now.isLeapYear())))
                                    .paymentDate(LocalDate.of(currentYear, m, 28))
                                    .grossEarnings(gross)
                                    .totalDeductions(BigDecimal.ZERO)
                                    .netSalary(gross)
                                    .status(m < currentMonthValue ? PayslipStatus.PROCESSED : PayslipStatus.DRAFT)
                                    .build();

                            payslipRepository.save(payslip);
                        }
                    }
                }
            }
        }
    }

    @Override
    @Transactional
    public void runPayrollCycle(String tenantId) {
        // Find all approved employees for the tenant
        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> e.getTenant().getCompanyName().equalsIgnoreCase(tenantId) ||
                        e.getTenant().getCompanyCode().equalsIgnoreCase(tenantId))
                .filter(e -> e.getStatus() == Employee.OnboardingStatus.APPROVED)
                .collect(Collectors.toList());

        PayrollPolicy policy = getPayrollPolicy(tenantId);
        LocalDate now = LocalDate.now();
        String monthName = now.getMonth().name();
        String currentMonth = monthName.substring(0, 1) + monthName.substring(1).toLowerCase() + " " + now.getYear();

        // First, check if there are any DRAFT payslips that should be marked as
        // PROCESSED
        List<Payslip> existingSlips = payslipRepository.findByMonthAndTenantId(currentMonth, tenantId);
        if (existingSlips.isEmpty()) {
            existingSlips = payslipRepository.findByMonthAndTenantId(currentMonth.toUpperCase(), tenantId);
        }

        if (!existingSlips.isEmpty()) {
            boolean processedAny = false;
            for (Payslip slip : existingSlips) {
                if (slip.getStatus() == PayslipStatus.DRAFT) {
                    slip.setStatus(PayslipStatus.PROCESSED);
                    payslipRepository.save(slip);
                    processedAny = true;
                }
            }
            if (processedAny)
                return; // If we processed existing ones, we're done with this toggle
        }

        for (Employee emp : employees) {
            // Check if payslip already exists for this month
            boolean exists = existingSlips.stream()
                    .anyMatch(p -> p.getEmployee().getId().equals(emp.getId()));

            if (exists)
                continue;

            // 1. Fetch Salary Structure
            com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure salaryStructure = salaryStructureRepository
                    .findByEmployeeIdAndTenantIdAndStatus(emp.getId(), tenantId,
                            com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure.SalaryStructureStatus.ACTIVE)
                    .orElse(null);

            BigDecimal monthlyGross = BigDecimal.ZERO;
            BigDecimal totalDeductions = BigDecimal.ZERO;

            BigDecimal basicVal;
            BigDecimal pfVal;
            BigDecimal profTaxVal;

            if (salaryStructure != null) {
                basicVal = salaryStructure.getBasicSalary();
                BigDecimal hra = salaryStructure.getHra() != null ? salaryStructure.getHra() : BigDecimal.ZERO;
                BigDecimal medical = salaryStructure.getMedicalAllowance() != null
                        ? salaryStructure.getMedicalAllowance()
                        : BigDecimal.ZERO;
                BigDecimal travel = salaryStructure.getTravelAllowance() != null ? salaryStructure.getTravelAllowance()
                        : BigDecimal.ZERO;
                BigDecimal special = salaryStructure.getSpecialAllowance() != null
                        ? salaryStructure.getSpecialAllowance()
                        : BigDecimal.ZERO;
                BigDecimal bonus = salaryStructure.getPerformanceBonus() != null ? salaryStructure.getPerformanceBonus()
                        : BigDecimal.ZERO;

                monthlyGross = basicVal.add(hra).add(medical).add(travel).add(special).add(bonus);

                pfVal = salaryStructure.getPfContribution() != null ? salaryStructure.getPfContribution()
                        : basicVal.multiply(BigDecimal.valueOf(0.12));
                BigDecimal esi = salaryStructure.getEsiContribution() != null ? salaryStructure.getEsiContribution()
                        : BigDecimal.ZERO;
                profTaxVal = salaryStructure.getProfessionalTax() != null ? salaryStructure.getProfessionalTax()
                        : BigDecimal.ZERO;
                BigDecimal tds = salaryStructure.getTds() != null ? salaryStructure.getTds() : BigDecimal.ZERO;
                BigDecimal loan = salaryStructure.getLoanDeduction() != null ? salaryStructure.getLoanDeduction()
                        : BigDecimal.ZERO;

                totalDeductions = pfVal.add(esi).add(profTaxVal).add(tds).add(loan);
            } else {
                monthlyGross = BigDecimal.valueOf(emp.getMonthlyGross() != null ? emp.getMonthlyGross()
                        : (emp.getAnnualCtc() != null ? emp.getAnnualCtc() / 12 : 0));
                basicVal = monthlyGross.multiply(BigDecimal.valueOf(0.5));
                pfVal = basicVal.multiply(BigDecimal.valueOf(0.12));
                profTaxVal = BigDecimal.valueOf(emp.getProfessionalTax() != null ? emp.getProfessionalTax() : 0);
                totalDeductions = pfVal.add(profTaxVal);
            }

            BigDecimal netPay = monthlyGross.subtract(totalDeductions);

            // 2. Create the Payslip object
            Payslip payslip = Payslip.builder()
                    .tenantId(tenantId)
                    .employee(emp)
                    .month(currentMonth)
                    .startDate(now.withDayOfMonth(1))
                    .endDate(now.withDayOfMonth(now.lengthOfMonth()))
                    .paymentDate(
                            now.withDayOfMonth(policy.getStandardPayDate() != null ? policy.getStandardPayDate() : 28))
                    .grossEarnings(monthlyGross)
                    .totalDeductions(totalDeductions)
                    .netSalary(netPay)
                    .status(PayslipStatus.DRAFT)
                    .build();

            // 3. Create and link components
            List<SalaryComponent> components = new ArrayList<>();
            if (salaryStructure != null) {
                components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING, basicVal));
                if (salaryStructure.getHra() != null && salaryStructure.getHra().compareTo(BigDecimal.ZERO) > 0)
                    components.add(
                            new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING, salaryStructure.getHra()));
                if (salaryStructure.getMedicalAllowance() != null
                        && salaryStructure.getMedicalAllowance().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Medical Allowance", ComponentType.EARNING,
                            salaryStructure.getMedicalAllowance()));
                if (salaryStructure.getTravelAllowance() != null
                        && salaryStructure.getTravelAllowance().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Travel Allowance", ComponentType.EARNING,
                            salaryStructure.getTravelAllowance()));
                if (salaryStructure.getSpecialAllowance() != null
                        && salaryStructure.getSpecialAllowance().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Special Allowance", ComponentType.EARNING,
                            salaryStructure.getSpecialAllowance()));
                if (salaryStructure.getPerformanceBonus() != null
                        && salaryStructure.getPerformanceBonus().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Performance Bonus", ComponentType.EARNING,
                            salaryStructure.getPerformanceBonus()));

                components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION, pfVal));
                if (salaryStructure.getEsiContribution() != null
                        && salaryStructure.getEsiContribution().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "ESI", ComponentType.DEDUCTION,
                            salaryStructure.getEsiContribution()));
                if (profTaxVal.compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Professional Tax", ComponentType.DEDUCTION,
                            profTaxVal));
                if (salaryStructure.getTds() != null && salaryStructure.getTds().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Income Tax (TDS)", ComponentType.DEDUCTION,
                            salaryStructure.getTds()));
                if (salaryStructure.getLoanDeduction() != null
                        && salaryStructure.getLoanDeduction().compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Loan Deduction", ComponentType.DEDUCTION,
                            salaryStructure.getLoanDeduction()));
            } else {
                components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING, basicVal));
                components.add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING,
                        monthlyGross.multiply(BigDecimal.valueOf(0.3))));
                components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION, pfVal));
                if (profTaxVal.compareTo(BigDecimal.ZERO) > 0)
                    components.add(new SalaryComponent(null, payslip, "Professional Tax", ComponentType.DEDUCTION,
                            profTaxVal));
            }

            payslip.setComponents(components);
            payslipRepository.save(payslip);
        }
    }

    @Override
    public com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO getEmployeeSalaryStructure(Long employeeId,
            String tenantId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure structure = salaryStructureRepository
                .findByEmployeeIdAndTenantId(employeeId, tenantId)
                .orElse(null);

        if (structure == null) {
            // Return empty structure based on legacy employee fields
            return com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO.builder()
                    .employeeId(employeeId)
                    .employeeName(employee.getFirstName() + " " + employee.getLastName())
                    .basicSalary(BigDecimal.valueOf(employee.getBasicSalary() != null ? employee.getBasicSalary() : 0))
                    .performanceBonus(BigDecimal
                            .valueOf(employee.getPerformanceBonus() != null ? employee.getPerformanceBonus() : 0))
                    .professionalTax(BigDecimal
                            .valueOf(employee.getProfessionalTax() != null ? employee.getProfessionalTax() : 0))
                    .annualCtc(BigDecimal.valueOf(employee.getAnnualCtc() != null ? employee.getAnnualCtc() : 0))
                    .status("NOT_ASSIGNED")
                    .build();
        }

        return convertToStructureDTO(structure);
    }

    @Override
    @Transactional
    public com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO updateEmployeeSalaryStructure(Long employeeId,
            String tenantId, com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure structure = salaryStructureRepository
                .findByEmployeeIdAndTenantId(employeeId, tenantId)
                .orElse(new com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure());

        structure.setEmployee(employee);
        structure.setTenantId(tenantId);
        structure.setBasicSalary(dto.getBasicSalary());
        structure.setHra(dto.getHra());
        structure.setMedicalAllowance(dto.getMedicalAllowance());
        structure.setTravelAllowance(dto.getTravelAllowance());
        structure.setSpecialAllowance(dto.getSpecialAllowance());
        structure.setPerformanceBonus(dto.getPerformanceBonus());
        structure.setPfContribution(dto.getPfContribution());
        structure.setEsiContribution(dto.getEsiContribution());
        structure.setProfessionalTax(dto.getProfessionalTax());
        structure.setTds(dto.getTds());
        structure.setLoanDeduction(dto.getLoanDeduction());
        structure.setEffectiveFrom(dto.getEffectiveFrom() != null ? dto.getEffectiveFrom() : LocalDate.now());
        structure.setStatus(com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure.SalaryStructureStatus.ACTIVE);

        structure = salaryStructureRepository.save(structure);

        // Sync with current month's DRAFT payslip if it exists
        LocalDate now = LocalDate.now();
        String currentMonthName = now.getMonth().name() + " " + now.getYear();
        List<Payslip> currentSlips = payslipRepository.findByMonthAndTenantId(currentMonthName, tenantId);
        Optional<Payslip> empSlip = currentSlips.stream()
                .filter(p -> p.getEmployee().getId().equals(employeeId) && p.getStatus() == PayslipStatus.DRAFT)
                .findFirst();

        BigDecimal earnings = structure.getBasicSalary()
                .add(structure.getHra() != null ? structure.getHra() : BigDecimal.ZERO)
                .add(structure.getMedicalAllowance() != null ? structure.getMedicalAllowance() : BigDecimal.ZERO)
                .add(structure.getTravelAllowance() != null ? structure.getTravelAllowance() : BigDecimal.ZERO)
                .add(structure.getSpecialAllowance() != null ? structure.getSpecialAllowance() : BigDecimal.ZERO)
                .add(structure.getPerformanceBonus() != null ? structure.getPerformanceBonus() : BigDecimal.ZERO);

        BigDecimal deductions = (structure.getPfContribution() != null ? structure.getPfContribution()
                : BigDecimal.ZERO)
                .add(structure.getEsiContribution() != null ? structure.getEsiContribution() : BigDecimal.ZERO)
                .add(structure.getProfessionalTax() != null ? structure.getProfessionalTax() : BigDecimal.ZERO)
                .add(structure.getTds() != null ? structure.getTds() : BigDecimal.ZERO)
                .add(structure.getLoanDeduction() != null ? structure.getLoanDeduction() : BigDecimal.ZERO);

        if (empSlip.isPresent()) {
            Payslip slip = empSlip.get();
            slip.setGrossEarnings(earnings);
            slip.setTotalDeductions(deductions);
            slip.setNetSalary(earnings.subtract(deductions));
            payslipRepository.save(slip);
        }

        // Update employee fields for backward compatibility and reporting
        if (dto.getBasicSalary() != null)
            employee.setBasicSalary(dto.getBasicSalary().doubleValue());
        if (dto.getPerformanceBonus() != null)
            employee.setPerformanceBonus(dto.getPerformanceBonus().doubleValue());
        if (dto.getProfessionalTax() != null)
            employee.setProfessionalTax(dto.getProfessionalTax().doubleValue());

        // Ensure monthlyGross and annualCtc are synced
        employee.setMonthlyGross(earnings.doubleValue());
        employee.setAnnualCtc(earnings.multiply(BigDecimal.valueOf(12)).doubleValue());

        employeeRepository.save(employee);

        return convertToStructureDTO(structure);
    }

    private com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO convertToStructureDTO(
            com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure s) {
        BigDecimal earnings = s.getBasicSalary()
                .add(s.getHra() != null ? s.getHra() : BigDecimal.ZERO)
                .add(s.getMedicalAllowance() != null ? s.getMedicalAllowance() : BigDecimal.ZERO)
                .add(s.getTravelAllowance() != null ? s.getTravelAllowance() : BigDecimal.ZERO)
                .add(s.getSpecialAllowance() != null ? s.getSpecialAllowance() : BigDecimal.ZERO)
                .add(s.getPerformanceBonus() != null ? s.getPerformanceBonus() : BigDecimal.ZERO);

        BigDecimal deductions = (s.getPfContribution() != null ? s.getPfContribution() : BigDecimal.ZERO)
                .add(s.getEsiContribution() != null ? s.getEsiContribution() : BigDecimal.ZERO)
                .add(s.getProfessionalTax() != null ? s.getProfessionalTax() : BigDecimal.ZERO)
                .add(s.getTds() != null ? s.getTds() : BigDecimal.ZERO)
                .add(s.getLoanDeduction() != null ? s.getLoanDeduction() : BigDecimal.ZERO);

        return com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO.builder()
                .id(s.getId())
                .employeeId(s.getEmployee().getId())
                .employeeName(s.getEmployee().getFirstName() + " " + s.getEmployee().getLastName())
                .basicSalary(s.getBasicSalary())
                .hra(s.getHra())
                .medicalAllowance(s.getMedicalAllowance())
                .travelAllowance(s.getTravelAllowance())
                .specialAllowance(s.getSpecialAllowance())
                .performanceBonus(s.getPerformanceBonus())
                .pfContribution(s.getPfContribution())
                .esiContribution(s.getEsiContribution())
                .professionalTax(s.getProfessionalTax())
                .tds(s.getTds())
                .loanDeduction(s.getLoanDeduction())
                .monthlyGross(earnings)
                .annualCtc(earnings.multiply(BigDecimal.valueOf(12)))
                .effectiveFrom(s.getEffectiveFrom())
                .status(s.getStatus().name())
                .build();
    }

    @Override
    public PayrollPolicy getPayrollPolicy(String tenantId) {
        return payrollPolicyRepository.findByTenantId(tenantId)
                .orElseGet(() -> {
                    PayrollPolicy defaultPolicy = PayrollPolicy.builder()
                            .tenantId(tenantId)
                            .payCycleFrequency("Monthly")
                            .standardPayDate(28)
                            .lopDeductionRule("Deduct based on attendance")
                            .overtimePolicy("Include in payroll")
                            .lopThresholdDays(2)
                            .avgWorkingDays(26)
                            .basicPercentage(40.0)
                            .hraPercentage(20.0)
                            .pfPercentage(12.0)
                            .build();
                    return payrollPolicyRepository.save(defaultPolicy);
                });
    }

    @Override
    @Transactional
    public PayrollPolicy updatePayrollPolicy(String tenantId, PayrollPolicy policy) {
        PayrollPolicy existing = getPayrollPolicy(tenantId);
        policy.setId(existing.getId());
        policy.setTenantId(tenantId);
        return payrollPolicyRepository.save(policy);
    }

    private BankDetailsDTO convertToBankDTO(BankDetails bankDetails) {
        return BankDetailsDTO.builder()
                .accountHolderName(bankDetails.getAccountHolderName())
                .bankName(bankDetails.getBankName())
                .accountNumber(bankDetails.getAccountNumber())
                .ifscCode(bankDetails.getIfscCode())
                .branchName(bankDetails.getBranchName())
                .accountType(bankDetails.getAccountType())
                .build();
    }

    @Override
    public com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO getPayrollHistory(String tenantId, int page,
            int size, String year) {
        // Ensure all months in current year are initialized so they show up in history
        ensurePayrollHistoryInitialized(tenantId);

        List<Payslip> allPayslips = payslipRepository.findByTenantId(tenantId);

        if (year != null && !year.isEmpty() && !"All".equalsIgnoreCase(year)) {
            allPayslips = allPayslips.stream()
                    .filter(p -> p.getMonth() != null && p.getMonth().contains(year))
                    .collect(Collectors.toList());
        }

        // 2. Group by Normalized Month Name
        Map<String, List<Payslip>> grouped = allPayslips.stream()
                .filter(p -> p.getMonth() != null && p.getMonth().contains(" "))
                .collect(Collectors.groupingBy(p -> {
                    String m = p.getMonth().trim();
                    return m.substring(0, 1).toUpperCase() + m.substring(1).toLowerCase();
                }));

        List<com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO.PayrollCycleDTO> cycles = new ArrayList<>();
        List<String> monthOrder = List.of("January", "February", "March", "April", "May", "June", "July", "August",
                "September", "October", "November", "December");

        grouped.forEach((monthYear, slips) -> {
            BigDecimal gross = slips.stream()
                    .map(p -> p.getGrossEarnings() != null ? p.getGrossEarnings() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal deductions = slips.stream()
                    .map(p -> p.getTotalDeductions() != null ? p.getTotalDeductions() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal net = slips.stream()
                    .map(p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Cycle status logic:
            // - If any failed -> FAILED
            // - If any draft -> DRAFT
            // - Otherwise -> COMPLETED
            String status = "COMPLETED";
            if (slips.stream().anyMatch(p -> p.getStatus() == PayslipStatus.FAILED)) {
                status = "FAILED";
            } else if (slips.stream().anyMatch(p -> p.getStatus() == PayslipStatus.DRAFT)) {
                status = "DRAFT";
            }

            String[] parts = monthYear.split(" ");
            String month = parts[0];
            String yr = parts.length > 1 ? parts[1] : "";

            cycles.add(com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO.PayrollCycleDTO.builder()
                    .id(monthYear)
                    .month(month)
                    .year(yr)
                    .status(status)
                    .grossSalary(gross)
                    .totalDeductions(deductions)
                    .netPayout(net)
                    .employees(slips.size())
                    .build());
        });

        // 3. Chronological Sort (Year Desc, Month Desc)
        cycles.sort((c1, c2) -> {
            int yearComp = c2.getYear().compareTo(c1.getYear());
            if (yearComp != 0)
                return yearComp;
            return Integer.compare(monthOrder.indexOf(c2.getMonth()), monthOrder.indexOf(c1.getMonth()));
        });

        // 4. Aggregate Totals (Only sum COMPLETED cycles for Disbursed YTD)
        BigDecimal totalYTD = cycles.stream()
                .filter(c -> !"DRAFT".equals(c.getStatus()))
                .map(c -> c.getNetPayout() != null ? c.getNetPayout() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Average Monthly Cost uses all non-draft months
        List<com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO.PayrollCycleDTO> processedCycles = cycles
                .stream()
                .filter(c -> !"DRAFT".equals(c.getStatus()))
                .collect(Collectors.toList());

        BigDecimal avgMonthly = processedCycles.isEmpty() ? BigDecimal.ZERO
                : processedCycles.stream()
                        .map(c -> c.getGrossSalary() != null ? c.getGrossSalary() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(processedCycles.size()), 2, java.math.RoundingMode.HALF_UP);

        int start = Math.min(page * size, cycles.size());
        int end = Math.min(start + size, cycles.size());
        List<com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO.PayrollCycleDTO> pagedCycles = cycles
                .subList(start, end);

        return com.hrm.hrm_saas.modules.payroll.dto.PayrollHistoryResponseDTO.builder()
                .cycles(pagedCycles)
                .totalPages((int) Math.ceil((double) cycles.size() / size))
                .totalElements(cycles.size())
                .totalYTD(totalYTD)
                .avgMonthlyCost(avgMonthly)
                .build();
    }
}
