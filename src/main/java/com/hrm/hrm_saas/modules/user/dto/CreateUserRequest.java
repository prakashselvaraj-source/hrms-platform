package com.hrm.hrm_saas.modules.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@lombok.extern.jackson.Jacksonized
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    private String tenant;
}
