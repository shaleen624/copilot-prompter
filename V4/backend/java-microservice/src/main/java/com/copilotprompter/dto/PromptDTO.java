package com.copilotprompter.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromptDTO {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Prompt content is required")
    private String prompt;
    
    private String description;
    private List<String> tags;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Language is required")
    private String language;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
    private Long viewCount;
    private Long copyCount;
}
