package com.hrm.hrm_saas.modules.auth.util;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailValidatorUtil {

    private final RestTemplate restTemplate;

    public boolean isDisposableEmail(String email) {
        try {
            String url = "https://api.apilayer.com/email_verification?email=" + email;

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", "YOUR_API_KEY");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Boolean isDisposable = (Boolean) response.getBody().get("is_disposable_email");

            return Boolean.TRUE.equals(isDisposable);

        } catch (Exception e) {
            return false;
        }
    }
}
