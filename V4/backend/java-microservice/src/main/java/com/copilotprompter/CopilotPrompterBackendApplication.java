package com.copilotprompter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CopilotPrompterBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CopilotPrompterBackendApplication.class, args);
    }
}
