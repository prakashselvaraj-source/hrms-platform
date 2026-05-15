package com.hrm.hrm_saas.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    /**
     * Registers the JavaTimeModule so that Java 8 date/time types
     * (LocalTime, LocalDate, LocalDateTime) are serialized as ISO strings
     * instead of timestamp arrays.
     *
     * This allows the frontend to send shift times as "09:00" and have them
     * correctly deserialized into LocalTime on the backend.
     */
    @Bean
    public org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer customizer() {
        return builder -> {
            builder.featuresToDisable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            builder.featuresToDisable(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        };
    }
}
