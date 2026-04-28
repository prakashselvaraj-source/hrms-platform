package com.hrm.hrm_saas.modules.auth.dto;

import lombok.Data;

@Data
public class RegisterCompanyRequest {
    private String companyName;
    private String subdomain;
    private String adminName;
    private String email;
    private String password;
}