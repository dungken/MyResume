package com.vinfast.charging;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = { "com.vinfast.charging.model" })
@EnableJpaRepositories(basePackages = { "com.vinfast.charging.repository" })
@EnableScheduling
public class ChargingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChargingBackendApplication.class, args);
	}

}
