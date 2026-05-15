package com.hrm.hrm_saas.modules.tenant.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    @Column(unique = true)
    private String companyCode;

    @Builder.Default
    private boolean setupComplete = false;

    // Organization Details
    private String industry;
    private String companySize;
    private String businessEmail;
    private String phoneNumber;
    private String country;
    private String timezone;
    private String website;
    private String registrationNumber;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String logoUrl;

    // Subscription Plan
    private String selectedPlan;

    // Enabled Modules
    @ElementCollection
    @CollectionTable(name = "tenant_modules", joinColumns = @JoinColumn(name = "tenant_id"))
    @Column(name = "module_name")
    @Builder.Default
    private java.util.Set<String> enabledModules = new java.util.HashSet<>();
}