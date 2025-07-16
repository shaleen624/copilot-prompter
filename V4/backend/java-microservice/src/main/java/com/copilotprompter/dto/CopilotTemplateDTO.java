package com.copilotprompter.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CopilotTemplateDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Language is required")
    private String language;
    
    private String framework;
    private String description;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private List<String> tags;
    private Long popularity;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
    private Boolean active;
    private Long viewCount;
    private Long downloadCount;
}
