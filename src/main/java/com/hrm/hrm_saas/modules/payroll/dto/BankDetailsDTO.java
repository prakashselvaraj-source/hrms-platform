package com.hrm.hrm_saas.modules.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankDetailsDTO {
    private String accountHolderName;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String accountType;
    private String branchName;
}
