package com.copilotprompter.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${app.name}")
    private String appName;

    @Value("${app.version}")
    private String appVersion;

    @Value("${server.port}")
    private String serverPort;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(appName + " API")
                        .version(appVersion)
                        .description("""
                                REST API for the Copilot Prompter application - a comprehensive platform for managing AI prompts and copilot templates.
                                
                                ## Features
                                - **Authentication**: JWT-based authentication with role-based access control
                                - **Prompts**: Manage AI prompts with categories, tags, and search functionality
                                - **Templates**: Manage copilot templates with framework-specific metadata
                                - **Admin**: User management and administrative functions
                                - **Security**: Role-based access (USER, ADMIN) with secure endpoints
                                
                                ## Authentication
                                1. Login with credentials to get an access token
                                2. Use the token in the Authorization header: `Bearer <token>`
                                3. Default admin credentials: username=`admin`, password=`admin123`
                                
                                ## Rate Limiting
                                API calls are rate-limited to ensure fair usage and system stability.
                                """)
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@copilotprompter.com")
                                .url("https://github.com/shaleen624/copilot-prompter"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + contextPath)
                                .description("Local development server"),
                        new Server()
                                .url("https://api.copilotprompter.com")
                                .description("Production server (if deployed)")
                ))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Repository and Documentation")
                        .url("https://github.com/shaleen624/copilot-prompter"))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token (without 'Bearer ' prefix)")));
    }
}
