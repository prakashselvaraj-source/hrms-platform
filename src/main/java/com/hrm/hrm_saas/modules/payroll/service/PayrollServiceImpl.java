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
import java.util.Optional;
import java.util.stream.Collectors;

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
                    if (p.getComponents() == null) return BigDecimal.ZERO;
                    return p.getComponents().stream()
                        .filter(c -> c.getType() == ComponentType.DEDUCTION && c.getName() != null && c.getName().toLowerCase().contains("tax"))
                        .map(c -> c.getAmount() != null ? c.getAmount() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Payslip latestPayslip = allPayslips.stream()
                .filter(p -> p.getStatus() == PayslipStatus.PAID || p.getStatus() == PayslipStatus.PROCESSED)
                .filter(p -> p.getPaymentDate() != null)
                .max((p1, p2) -> p1.getPaymentDate().compareTo(p2.getPaymentDate()))
                .orElse(null);

        BankDetails bankDetails = bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId).orElse(null);

        String bankName = bankDetails != null ? bankDetails.getBankName() : (employee.getBankName() != null ? employee.getBankName() : "Not Set");
        String accNum = bankDetails != null ? bankDetails.getAccountNumber() : (employee.getAccountNumber() != null ? employee.getAccountNumber() : "");
        String lastFour = (accNum != null && accNum.length() > 4) ? accNum.substring(accNum.length() - 4) : "****";

        return PayrollOverviewDTO.builder()
                .netTakeHome(latestPayslip != null && latestPayslip.getNetSalary() != null ? latestPayslip.getNetSalary() : BigDecimal.ZERO)
                .ytdEarnings(ytdEarnings)
                .ytdTax(ytdTax)
                .nextPayDay("Scheduled") 
                .bankName(bankName)
                .accountLastFour(lastFour)
                .build();
    }

    @Override
    public Page<PayslipResponseDTO> getPayslips(String tenantId, String email, Pageable pageable) {
        Employee employee = getEmployeeByEmail(email, tenantId);
        if (employee == null) return Page.empty(pageable);
        Page<Payslip> payslips = payslipRepository.findByEmployeeIdAndTenantIdOrderByPaymentDateDesc(employee.getId(), tenantId, pageable);
        return payslips.map(this::convertToResponseDTO);
    }

    @Override
    public BankDetailsDTO getBankDetails(String tenantId, String email) {
        System.out.println("PayrollServiceImpl.getBankDetails: tenantId=" + tenantId + ", email=" + email);
        Employee employee = getEmployeeByEmail(email, tenantId);
        if (employee == null) return new BankDetailsDTO();
        
        BankDetails bankDetails = bankDetailsRepository.findByEmployeeIdAndTenantId(employee.getId(), tenantId).orElse(null);
        
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
        if (employee == null) throw new RuntimeException("Cannot update bank details: Employee profile not found");
        
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
            "professionalTax", employee.getProfessionalTax()
        );
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
            Optional<Employee> emp = employeeRepository.findByWorkEmailAndTenant(trimmedEmail, tenantOpt.get());
            if (emp.isPresent()) return emp.get();
            
            emp = employeeRepository.findByWorkEmailIgnoreCase(trimmedEmail);
            if (emp.isPresent() && emp.get().getTenant().getId().equals(tenantOpt.get().getId())) {
                return emp.get();
            }
        }

        // 2. Try lookup via User entity
        Optional<User> userOpt = userRepository.findByEmail(trimmedEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getTenant() != null) {
                Optional<Employee> emp = employeeRepository.findByWorkEmailAndTenant(trimmedEmail, user.getTenant());
                if (emp.isPresent()) return emp.get();
            }
        }

        // 3. Last resort: find by email globally
        Employee employee = employeeRepository.findByWorkEmailIgnoreCase(trimmedEmail).orElse(null);
        if (employee != null) return employee;
        
        System.out.println("WARNING: Employee not found for " + trimmedEmail);
        return null; // Return null so callers can handle it gracefully
    }

    private PayslipResponseDTO convertToResponseDTO(Payslip payslip) {
        List<SalaryComponent> components = payslip.getComponents();
        if (components == null) components = new ArrayList<>();

        List<PayslipResponseDTO.ComponentDTO> earnings = components.stream()
                .filter(c -> c.getType() == ComponentType.EARNING)
                .map(c -> new PayslipResponseDTO.ComponentDTO(c.getName(), c.getAmount()))
                .collect(Collectors.toList());

        List<PayslipResponseDTO.ComponentDTO> deductions = components.stream()
                .filter(c -> c.getType() == ComponentType.DEDUCTION)
                .map(c -> new PayslipResponseDTO.ComponentDTO(c.getName(), c.getAmount()))
                .collect(Collectors.toList());

        return PayslipResponseDTO.builder()
                .id(payslip.getId())
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
        } catch (RuntimeException e) {
            System.out.println("Employee not found for seeding. Attempting to create from User record...");
            User user = userRepository.findByEmail(trimmedEmail)
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
                    .lastName(user.getName().contains(" ") ? user.getName().substring(user.getName().indexOf(" ") + 1) : "")
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

        // Now seed the payslips...
        String[] months = {"January 2026", "February 2026", "March 2026"};
        LocalDate[] payDates = {LocalDate.of(2026, 1, 31), LocalDate.of(2026, 2, 28), LocalDate.of(2026, 3, 31)};

        for (int i = 0; i < months.length; i++) {
            Payslip payslip = Payslip.builder()
                    .tenantId(tenantId)
                    .employee(employee)
                    .month(months[i])
                    .startDate(payDates[i].withDayOfMonth(1))
                    .endDate(payDates[i])
                    .paymentDate(payDates[i])
                    .grossEarnings(new BigDecimal("50000.00"))
                    .totalDeductions(new BigDecimal("5000.00"))
                    .netSalary(new BigDecimal("45000.00"))
                    .status(PayslipStatus.PAID)
                    .build();

            List<SalaryComponent> components = new ArrayList<>();
            components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING, new BigDecimal("30000.00")));
            components.add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING, new BigDecimal("15000.00")));
            components.add(new SalaryComponent(null, payslip, "Special Allowance", ComponentType.EARNING, new BigDecimal("5000.00")));
            components.add(new SalaryComponent(null, payslip, "Income Tax", ComponentType.DEDUCTION, new BigDecimal("3000.00")));
            components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION, new BigDecimal("2000.00")));

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
    }

    @Override
    public AdminPayrollOverviewDTO getAdminOverview(String tenantId) {
        List<Payslip> currentMonthPayslips = payslipRepository.findAll().stream()
                .filter(p -> p.getTenantId().equals(tenantId))
                .filter(p -> p.getPaymentDate() != null && p.getPaymentDate().getMonth() == LocalDate.now().getMonth())
                .collect(Collectors.toList());

        BigDecimal totalCost = currentMonthPayslips.stream()
                .map(p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeductions = currentMonthPayslips.stream()
                .map(p -> p.getTotalDeductions() != null ? p.getTotalDeductions() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalEmployees = employeeRepository.findAll().stream()
                .filter(e -> e.getTenant().getCompanyName().equalsIgnoreCase(tenantId) || 
                             e.getTenant().getCompanyCode().equalsIgnoreCase(tenantId))
                .count();

        return AdminPayrollOverviewDTO.builder()
                .totalPayrollCost(totalCost)
                .employeesProcessed((long) currentMonthPayslips.size())
                .totalEmployees(totalEmployees)
                .totalDeductions(totalDeductions)
                .lopCases(0) // Logic for LOP cases would go here
                .currentMonth(LocalDate.now().getMonth().name() + " " + LocalDate.now().getYear())
                .cycleStatus("IN_PROGRESS")
                .currentStep(4)
                .alerts(new ArrayList<>())
                .build();
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
        String currentMonth = now.getMonth().name() + " " + now.getYear();

        for (Employee emp : employees) {
            // Check if payslip already exists for this month
            boolean exists = payslipRepository.findAll().stream()
                    .filter(p -> p.getEmployee().getId().equals(emp.getId()))
                    .filter(p -> p.getMonth().equalsIgnoreCase(currentMonth))
                    .anyMatch(p -> true);
            
            if (exists) continue;

            // 1. Fetch Salary Structure
            com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure salaryStructure = salaryStructureRepository
                .findByEmployeeIdAndTenantIdAndStatus(emp.getId(), tenantId, com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure.SalaryStructureStatus.ACTIVE)
                .orElse(null);

            BigDecimal monthlyGross = BigDecimal.ZERO;
            BigDecimal totalDeductions = BigDecimal.ZERO;
            
            BigDecimal basicVal;
            BigDecimal pfVal;
            BigDecimal profTaxVal;
            
            if (salaryStructure != null) {
                basicVal = salaryStructure.getBasicSalary();
                BigDecimal hra = salaryStructure.getHra() != null ? salaryStructure.getHra() : BigDecimal.ZERO;
                BigDecimal medical = salaryStructure.getMedicalAllowance() != null ? salaryStructure.getMedicalAllowance() : BigDecimal.ZERO;
                BigDecimal travel = salaryStructure.getTravelAllowance() != null ? salaryStructure.getTravelAllowance() : BigDecimal.ZERO;
                BigDecimal special = salaryStructure.getSpecialAllowance() != null ? salaryStructure.getSpecialAllowance() : BigDecimal.ZERO;
                BigDecimal bonus = salaryStructure.getPerformanceBonus() != null ? salaryStructure.getPerformanceBonus() : BigDecimal.ZERO;
                
                monthlyGross = basicVal.add(hra).add(medical).add(travel).add(special).add(bonus);
                
                pfVal = salaryStructure.getPfContribution() != null ? salaryStructure.getPfContribution() : basicVal.multiply(BigDecimal.valueOf(0.12));
                BigDecimal esi = salaryStructure.getEsiContribution() != null ? salaryStructure.getEsiContribution() : BigDecimal.ZERO;
                profTaxVal = salaryStructure.getProfessionalTax() != null ? salaryStructure.getProfessionalTax() : BigDecimal.ZERO;
                BigDecimal tds = salaryStructure.getTds() != null ? salaryStructure.getTds() : BigDecimal.ZERO;
                BigDecimal loan = salaryStructure.getLoanDeduction() != null ? salaryStructure.getLoanDeduction() : BigDecimal.ZERO;

                totalDeductions = pfVal.add(esi).add(profTaxVal).add(tds).add(loan);
            } else {
                monthlyGross = BigDecimal.valueOf(emp.getMonthlyGross() != null ? emp.getMonthlyGross() : (emp.getAnnualCtc() != null ? emp.getAnnualCtc() / 12 : 0));
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
                    .paymentDate(now.withDayOfMonth(policy.getStandardPayDate() != null ? policy.getStandardPayDate() : 28))
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
                    components.add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING, salaryStructure.getHra()));
                if (salaryStructure.getMedicalAllowance() != null && salaryStructure.getMedicalAllowance().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Medical Allowance", ComponentType.EARNING, salaryStructure.getMedicalAllowance()));
                if (salaryStructure.getTravelAllowance() != null && salaryStructure.getTravelAllowance().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Travel Allowance", ComponentType.EARNING, salaryStructure.getTravelAllowance()));
                if (salaryStructure.getSpecialAllowance() != null && salaryStructure.getSpecialAllowance().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Special Allowance", ComponentType.EARNING, salaryStructure.getSpecialAllowance()));
                if (salaryStructure.getPerformanceBonus() != null && salaryStructure.getPerformanceBonus().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Performance Bonus", ComponentType.EARNING, salaryStructure.getPerformanceBonus()));

                components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION, pfVal));
                if (salaryStructure.getEsiContribution() != null && salaryStructure.getEsiContribution().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "ESI", ComponentType.DEDUCTION, salaryStructure.getEsiContribution()));
                if (profTaxVal.compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Professional Tax", ComponentType.DEDUCTION, profTaxVal));
                if (salaryStructure.getTds() != null && salaryStructure.getTds().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Income Tax (TDS)", ComponentType.DEDUCTION, salaryStructure.getTds()));
                if (salaryStructure.getLoanDeduction() != null && salaryStructure.getLoanDeduction().compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Loan Deduction", ComponentType.DEDUCTION, salaryStructure.getLoanDeduction()));
            } else {
                components.add(new SalaryComponent(null, payslip, "Basic Salary", ComponentType.EARNING, basicVal));
                components.add(new SalaryComponent(null, payslip, "HRA", ComponentType.EARNING, monthlyGross.multiply(BigDecimal.valueOf(0.3))));
                components.add(new SalaryComponent(null, payslip, "Provident Fund", ComponentType.DEDUCTION, pfVal));
                if (profTaxVal.compareTo(BigDecimal.ZERO) > 0) 
                    components.add(new SalaryComponent(null, payslip, "Professional Tax", ComponentType.DEDUCTION, profTaxVal));
            }

            payslip.setComponents(components);
            payslipRepository.save(payslip);
        }
    }

    @Override
    public com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO getEmployeeSalaryStructure(Long employeeId, String tenantId) {
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
                    .performanceBonus(BigDecimal.valueOf(employee.getPerformanceBonus() != null ? employee.getPerformanceBonus() : 0))
                    .professionalTax(BigDecimal.valueOf(employee.getProfessionalTax() != null ? employee.getProfessionalTax() : 0))
                    .annualCtc(BigDecimal.valueOf(employee.getAnnualCtc() != null ? employee.getAnnualCtc() : 0))
                    .status("NOT_ASSIGNED")
                    .build();
        }

        return convertToStructureDTO(structure);
    }

    @Override
    @Transactional
    public com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO updateEmployeeSalaryStructure(Long employeeId, String tenantId, com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO dto) {
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

        // Optional: Update employee fields for backward compatibility
        if (dto.getBasicSalary() != null) employee.setBasicSalary(dto.getBasicSalary().doubleValue());
        if (dto.getPerformanceBonus() != null) employee.setPerformanceBonus(dto.getPerformanceBonus().doubleValue());
        if (dto.getProfessionalTax() != null) employee.setProfessionalTax(dto.getProfessionalTax().doubleValue());
        employeeRepository.save(employee);

        return convertToStructureDTO(structure);
    }

    private com.hrm.hrm_saas.modules.payroll.dto.SalaryStructureDTO convertToStructureDTO(com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure s) {
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
}
