package com.hrm.hrm_saas.common.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserActivityFilter extends OncePerRequestFilter {

    private final com.hrm.hrm_saas.modules.user.service.UserService userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null
                    && authentication.isAuthenticated()) {

                String email = authentication.getName();

                if (email != null
                        && !"anonymousUser".equals(email)
                        && !"anonymous".equals(email)) {

                    userService.updateLastSeen(email);
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "Error in UserActivityFilter: "
                            + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}