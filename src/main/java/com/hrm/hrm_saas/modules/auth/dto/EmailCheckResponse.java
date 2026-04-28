package com.hrm.hrm_saas.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailCheckResponse {
     private boolean exists;
     private boolean disposable;
}
