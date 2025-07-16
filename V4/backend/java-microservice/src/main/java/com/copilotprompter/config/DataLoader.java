package com.copilotprompter.config;

import com.copilotprompter.model.CopilotTemplate;
import com.copilotprompter.model.Prompt;
import com.copilotprompter.model.User;
import com.copilotprompter.repository.CopilotTemplateRepository;
import com.copilotprompter.repository.PromptRepository;
import com.copilotprompter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PromptRepository promptRepository;
    private final CopilotTemplateRepository templateRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username}")
    private String defaultAdminUsername;

    @Value("${app.admin.default-password}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) throws Exception {
        loadDefaultAdmin();
        loadSamplePrompts();
        loadSampleTemplates();
    }

    private void loadDefaultAdmin() {
        if (!userRepository.existsByUsername(defaultAdminUsername)) {
            User admin = new User();
            admin.setUsername(defaultAdminUsername);
            admin.setEmail("admin@copilotprompter.com");
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            admin.setAccountNonExpired(true);
            admin.setAccountNonLocked(true);
            admin.setCredentialsNonExpired(true);

            userRepository.save(admin);
            log.info("Default admin user created with username: {}", defaultAdminUsername);
        }
    }

    private void loadSamplePrompts() {
        if (promptRepository.count() == 0) {
            Prompt prompt1 = new Prompt();
            prompt1.setTitle("Angular Component Development");
            prompt1.setPrompt("Create an Angular component that follows these guidelines:\n\n1. Use OnPush change detection strategy\n2. Implement proper TypeScript typing\n3. Follow Angular style guide conventions\n4. Include proper error handling\n5. Use reactive forms where applicable\n6. Implement accessibility features\n7. Write unit tests\n\nComponent requirements:\n- [Specify your component requirements here]\n\nPlease ensure the component is production-ready and follows Angular best practices.");
            prompt1.setDescription("A comprehensive prompt for creating Angular components with best practices");
            prompt1.setTags(List.of("angular", "typescript", "component", "best-practices", "testing"));
            prompt1.setCategory("Frontend");
            prompt1.setLanguage("TypeScript");
            prompt1.setAuthor("System");
            prompt1.setActive(true);
            prompt1.setViewCount(0L);
            prompt1.setCopyCount(0L);

            Prompt prompt2 = new Prompt();
            prompt2.setTitle("Spring Boot REST API Development");
            prompt2.setPrompt("Create a Spring Boot REST API that includes:\n\n1. Proper layered architecture (Controller, Service, Repository)\n2. JPA entity mappings\n3. Input validation with Bean Validation\n4. Exception handling with @ControllerAdvice\n5. OpenAPI/Swagger documentation\n6. Security with JWT authentication\n7. Unit and integration tests\n8. Database migrations\n\nAPI requirements:\n- [Specify your API requirements here]\n\nPlease ensure the API follows RESTful principles and Spring Boot best practices.");
            prompt2.setDescription("A comprehensive prompt for creating Spring Boot REST APIs");
            prompt2.setTags(List.of("spring-boot", "java", "rest-api", "jwt", "testing"));
            prompt2.setCategory("Backend");
            prompt2.setLanguage("Java");
            prompt2.setAuthor("System");
            prompt2.setActive(true);
            prompt2.setViewCount(0L);
            prompt2.setCopyCount(0L);

            promptRepository.saveAll(List.of(prompt1, prompt2));
            log.info("Sample prompts loaded");
        }
    }

    private void loadSampleTemplates() {
        if (templateRepository.count() == 0) {
            CopilotTemplate template1 = new CopilotTemplate();
            template1.setName("Angular Development Guidelines");
            template1.setCategory("Frontend Framework");
            template1.setLanguage("TypeScript");
            template1.setFramework("Angular");
            template1.setDescription("Comprehensive guidelines for Angular development with modern best practices");
            template1.setContent("""
                # Angular Project Guidelines
                
                ## Project Context
                This is an Angular application following modern development practices with TypeScript, Angular Material, and reactive programming patterns.
                
                ## Coding Standards
                - Use TypeScript strict mode and proper type definitions
                - Follow Angular style guide conventions
                - Implement OnPush change detection strategy where possible
                - Use reactive forms over template-driven forms
                - Implement proper error handling and logging
                - Use standalone components when appropriate
                - Follow dependency injection best practices
                
                ## Architecture Guidelines
                - Organize code using feature modules
                - Use services for business logic and state management
                - Implement proper separation of concerns
                - Use RxJS operators effectively
                - Follow lazy loading patterns for routing
                - Implement proper state management (NgRx if needed)
                
                ## Framework-Specific Rules
                - Use Angular CLI for generation and builds
                - Implement proper lifecycle hooks
                - Use Angular Material for UI components
                - Follow Angular security best practices
                - Implement proper testing strategies (unit, integration, e2e)
                
                ## Testing Preferences
                - Write unit tests for all components and services
                - Use TestBed for component testing
                - Mock dependencies properly
                - Implement integration tests for critical flows
                - Maintain high test coverage
                
                ## Performance Considerations
                - Use OnPush change detection
                - Implement virtual scrolling for large lists
                - Use trackBy functions in ngFor
                - Lazy load modules and components
                - Optimize bundle size
                """);
            template1.setTags(List.of("angular", "typescript", "frontend", "best-practices"));
            template1.setAuthor("System");
            template1.setActive(true);
            template1.setPopularity(0L);
            template1.setViewCount(0L);
            template1.setDownloadCount(0L);

            CopilotTemplate template2 = new CopilotTemplate();
            template2.setName("Spring Boot API Development");
            template2.setCategory("Backend Framework");
            template2.setLanguage("Java");
            template2.setFramework("Spring Boot");
            template2.setDescription("Best practices for developing REST APIs with Spring Boot");
            template2.setContent("""
                # Spring Boot API Development Guidelines
                
                ## Project Context
                This is a Spring Boot application for building RESTful APIs with security, validation, and proper architecture.
                
                ## Coding Standards
                - Use Java 17+ features when appropriate
                - Follow Spring Boot conventions and annotations
                - Implement proper exception handling
                - Use validation annotations for input validation
                - Follow REST API best practices
                - Implement proper logging with SLF4J
                
                ## Architecture Guidelines
                - Use layered architecture (Controller, Service, Repository)
                - Implement proper dependency injection
                - Use DTOs for data transfer
                - Separate business logic from presentation logic
                - Use transactions appropriately
                - Implement caching where needed
                
                ## Framework-Specific Rules
                - Use Spring Security for authentication/authorization
                - Implement OpenAPI/Swagger documentation
                - Use Spring Data JPA for database operations
                - Follow Spring Boot auto-configuration principles
                - Use profiles for different environments
                
                ## Database Guidelines
                - Use JPA entities with proper mappings
                - Implement database migrations with Flyway/Liquibase
                - Use repository pattern for data access
                - Implement proper transaction management
                - Use connection pooling
                
                ## Security Best Practices
                - Implement JWT-based authentication
                - Use proper CORS configuration
                - Validate all inputs
                - Implement rate limiting
                - Use HTTPS in production
                
                ## Testing Preferences
                - Write unit tests for all layers
                - Use @SpringBootTest for integration tests
                - Mock external dependencies
                - Test security configurations
                - Implement test containers for database tests
                """);
            template2.setTags(List.of("spring-boot", "java", "backend", "rest-api", "security"));
            template2.setAuthor("System");
            template2.setActive(true);
            template2.setPopularity(0L);
            template2.setViewCount(0L);
            template2.setDownloadCount(0L);

            templateRepository.saveAll(List.of(template1, template2));
            log.info("Sample templates loaded");
        }
    }
}
