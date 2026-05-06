package com.hrm.hrm_saas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
public class HrmSaasApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrmSaasApplication.class, args);
	}

}
