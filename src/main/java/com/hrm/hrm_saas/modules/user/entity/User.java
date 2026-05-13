package com.hrm.hrm_saas.modules.user.entity;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    private String role; // SUPER_ADMIN,ADMIN, EMPLOYEE

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;
}