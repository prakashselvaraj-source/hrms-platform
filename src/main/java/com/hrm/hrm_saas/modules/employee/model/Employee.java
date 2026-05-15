package com.hrm.hrm_saas.modules.employee.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.hrm_saas.modules.role.model.Role;
import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.payroll.entity.Payslip;
import com.hrm.hrm_saas.modules.payroll.entity.SalaryStructure;
import com.hrm.hrm_saas.modules.payroll.entity.BankDetails;
import com.hrm.hrm_saas.modules.leave.entity.LeaveRequest;
import com.hrm.hrm_saas.modules.task.entity.Task;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "tenantId", nullable = false)
    private Tenant tenant;

    // Personal Info
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    @Column(nullable = false)
    private String gender;
    @Column(nullable = false)
    private String workEmail;
    @Column(nullable = false)
    private String mobileNumber;
    private String photoUrl;

    // Contact - Current Address
    @Column(nullable = false)
    private String currentStreet;
    @Column(nullable = false)
    private String currentCity;
    @Column(nullable = false)
    private String currentState;
    @Column(nullable = false)
    private String currentZip;
    @Column(nullable = false)
    private String currentCountry;

    // Contact - Permanent Address
    private String permanentStreet;
    private String permanentCity;
    private String permanentState;

    // Emergency Contact
    @Column(nullable = false)
    private String emergencyContactName;
    @Column(nullable = false)
    private String emergencyContactRelationship;
    @Column(nullable = false)
    private String emergencyContactMobile;

    // Job Details
    @Column(nullable = false)
    private LocalDate dateOfJoining;
    private String reportingManager;
    @Column(nullable = false)
    private String workLocation;
    @Column(nullable = false)
    private String employmentType;
    @Column(nullable = false)
    private String designation;
    @Column(nullable = false)
    private String department;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payslip> payslips;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveRequest> leaveRequests;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private SalaryStructure salaryStructure;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private BankDetails bankDetails;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> assignedTasks;

    @OneToMany(mappedBy = "assignedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> createdTasks;

    @ManyToOne
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    // Banking
    @Column(nullable = false)
    private String accountHolderName;
    @Column(nullable = false)
    private String bankName;
    @Column(nullable = false)
    private String branchName;
    @Column(nullable = false)
    private String accountNumber;
    @Column(nullable = false)
    private String ifscSwiftCode;
    @Column(nullable = false)
    private String aadharNumber;
    @Column(nullable = false)
    private String panNumber;
    @Column(nullable = false)
    private String disbursementMethod;

    // Salary
    @Column(nullable = false)
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
    private java.util.List<String> otherDocUrls;
    // Meta
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OnboardingStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = OnboardingStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum OnboardingStatus {
        PENDING, APPROVED, REJECTED, DRAFT
    }
}
