package com.hrm.hrm_saas.common.tenant;

import jakarta.servlet.http.HttpServletRequest;

public class TenantResolver {

    public static String resolve(HttpServletRequest request) {
        String host = request.getServerName(); 
        // tcs.localhost OR tcs.yourapp.com

        if (host == null) return null;

        String[] parts = host.split("\\.");

        if (parts.length >= 2) {
            return parts[0]; // tcs
        }

        return null;
    }
}