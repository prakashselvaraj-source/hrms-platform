package com.hrm.hrm_saas.modules.tenant.dto;

import com.hrm.hrm_saas.modules.location.dto.WorkLocationDTO;
import com.hrm.hrm_saas.modules.shift.dto.ShiftDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

/**
 * Full tenant response DTO that consolidates all setup data into a single API response.
 * Returned by GET /api/tenants/full-details so the frontend only needs ONE call
 * to hydrate the entire Organization Setup Wizard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantFullDetailsDTO {

    // ── Core Identity ──────────────────────────────────────────────────────
    private Long id;
    private String companyCode;
    private boolean setupComplete;

    // ── Company Information (Step 1) ───────────────────────────────────────
    private String companyName;
    private String industry;
    private String companySize;
    private String businessEmail;
    private String phoneNumber;
    private String country;
    private String timezone;
    private String website;
    private String registrationNumber;
    private String logoUrl;

    // ── Subscription Plan (Step 2) ─────────────────────────────────────────
    private String selectedPlan;

    // ── Work Locations (Step 3) ────────────────────────────────────────────
    private List<WorkLocationDTO> locations;

    // ── Shifts (Step 4) ───────────────────────────────────────────────────
    private List<ShiftDTO> shifts;

    // ── Enabled Modules (Step 5) ───────────────────────────────────────────
    private Set<String> enabledModules;
}
