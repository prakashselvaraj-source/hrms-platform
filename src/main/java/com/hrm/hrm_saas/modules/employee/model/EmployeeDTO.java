package com.hrm.hrm_saas.modules.employee.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hrm.hrm_saas.modules.employee.model.Employee.OnboardingStatus;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private Long id;
    private String tenantId;
    private Long roleId;

    // Personal Info
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Work email is required")
    private String workEmail;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String photoUrl;

    // Current Address
    @NotBlank(message = "Current city is required")
    private String currentCity;
    @NotBlank(message = "Current street is required")
    private String currentStreet;
    @NotBlank(message = "Current state is required")
    private String currentState;
    @NotBlank(message = "Current zipcode is required")
    private String currentZip;
    @NotBlank(message = "Current country is required")
    private String currentCountry;

    // Permanent Address
    private String permanentStreet;
    private String permanentCity;
    private String permanentState;

    // Emergency Contact
    @NotBlank(message = "Emergency contact name is required")
    private String emergencyContactName;

    @NotBlank(message = "Emergency contact mobile is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Emergency contact must be 10 digits")
    private String emergencyContactMobile;

    @NotBlank(message = "Emergency Contact is required")
    private String emergencyContactRelationship;

    // Job Details
    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;
    private String reportingManager;
    @NotBlank(message = "Work location is required")
    private String workLocation;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    // Banking
    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;

    @NotBlank(message = "Bank name is required")
    private String bankName;
    @NotBlank(message = "Branch Name is required")
    private String branchName;

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotBlank(message = "IFSC code is required")
    private String ifscSwiftCode;
    @NotBlank(message = "Aadhar number is required")
    private String aadharNumber;
    @NotBlank(message = "Pan number is required")
    private String panNumber;
    @NotBlank(message = "Disbursement is required")
    private String disbursementMethod;

    // Salary
    @NotNull(message = "Annual CTC is required")
    @Positive(message = "CTC must be positive")
    private Double annualCtc;
    @NotNull(message = "Monthly gross is required")
    private Double monthlyGross;

    @NotNull(message = "Basic salary is required")
    private Double basicSalary;

    @NotNull(message = "Performance bonus is required")
    private Double performanceBonus;

    @NotNull(message = "Professional tax is required")
    private Double professionalTax;

    // Documents
    @NotBlank(message = "Identity proof URL is required")
    private String identityProofUrl;
    @NotBlank(message = "Education certificate URL is required")
    private String educationCertUrl;
    @NotBlank(message = "Employment proof URL is required")
    private String employmentProofUrl;

    private java.util.List<String> otherDocUrls;
    // Meta
    @NotBlank(message = "Role is required")
    private String role;
    @NotNull(message = "Status is required")
    private OnboardingStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}