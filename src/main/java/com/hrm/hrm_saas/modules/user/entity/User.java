package com.hrm.hrm_saas.modules.user.entity;

import com.hrm.hrm_saas.modules.tenant.entity.Tenant;
import com.hrm.hrm_saas.modules.user.enums.UserRole;

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

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @Column(name = "last_seen", nullable = true)
    private LocalDateTime lastSeen;

    @Column(name = "is_online", nullable = true)
    private Boolean isOnline;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;
}