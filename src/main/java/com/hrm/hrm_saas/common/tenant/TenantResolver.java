package com.hrm.hrm_saas.common.tenant;

import jakarta.servlet.http.HttpServletRequest;

public class TenantResolver {

    public static String resolve(HttpServletRequest request) {
        // 1. Check Header (Prioritize for frontend flexibility)
        String tenantHeader = request.getHeader("X-Tenant-Id");
        if (tenantHeader != null && !tenantHeader.isEmpty()) {
            return tenantHeader;
        }

        // 2. Fallback to Subdomain
        String host = request.getServerName(); 
        if (host == null) return null;

        String[] parts = host.split("\\.");
        if (parts.length >= 2) {
            return parts[0];
        }

        return null;
    }
}