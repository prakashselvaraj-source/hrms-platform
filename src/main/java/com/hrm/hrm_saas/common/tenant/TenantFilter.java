package com.hrm.hrm_saas.common.tenant;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

import org.springframework.stereotype.Component;

@Component
public class TenantFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;

        String tenant = TenantResolver.resolve(request);
        TenantContext.set(tenant);

        try {
            chain.doFilter(req, res);
        } finally {
            TenantContext.clear();
        }
    }
}