package com.hrm.hrm_saas.modules.employee.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenantId;

    // Personal Info
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String workEmail;
    private String mobileNumber;
    private String photoUrl;

    // Contact - Current Address
    private String currentStreet;
    private String currentCity;
    private String currentState;
    private String currentZip;
    private String currentCountry;

    // Contact - Permanent Address
    private String permanentStreet;
    private String permanentCity;
    private String permanentState;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactRelationship;
    private String emergencyContactMobile;

    // Job Details
    private LocalDate dateOfJoining;
    private String reportingManager;
    private String workLocation;
    private String employmentType;
    private String designation;
    private String department;

    // Banking
    private String accountHolderName;
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String ifscSwiftCode;
    private String aadharNumber;
    private String panNumber;
    private String disbursementMethod;

    // Salary
    private Double annualCtc;
    private Double monthlyGross;
    private Double basicSalary;
    private Double performanceBonus;
    private Double professionalTax;

    // Documents
    private String identityProofUrl;
    private String educationCertUrl;
    private String employmentProofUrl;

    @ElementCollection
    @CollectionTable(name = "employee_other_docs", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "file_url")
    private java.util.List<String> otherDocUrl;
    // Meta
    @Enumerated(EnumType.STRING)
    private OnboardingStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = OnboardingStatus.DRAFT;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum OnboardingStatus {
        DRAFT, ACTIVE, INACTIVE
    }
}
