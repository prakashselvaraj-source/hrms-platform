package com.hrm.hrm_saas.modules.role.model;

import com.hrm.hrm_saas.modules.role.model.Role.AccessLevel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleDTO {

    @NotBlank
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Access level is required")
    private AccessLevel accessLevel;
    
}