package com.copilotprompter.controller;

import com.copilotprompter.dto.PromptDTO;
import com.copilotprompter.service.PromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Prompts", description = "Prompt management endpoints")
public class PromptController {

    private final PromptService promptService;

    @GetMapping
    @Operation(summary = "Get all prompts", description = "Retrieve all active prompts with optional pagination")
    public ResponseEntity<Page<PromptDTO>> getAllPrompts(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filter by category") @RequestParam(required = false) String category,
            @Parameter(description = "Filter by language") @RequestParam(required = false) String language,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, 
            Sort.Direction.fromString(sortDir), sortBy);

        Page<PromptDTO> prompts;
        if (category != null || language != null || search != null) {
            prompts = promptService.getPromptsWithFilters(category, language, search, pageable);
        } else {
            prompts = promptService.getPrompts(pageable);
        }

        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prompt by ID", description = "Retrieve a specific prompt by its ID")
    public ResponseEntity<PromptDTO> getPromptById(@PathVariable Long id) {
        return promptService.getPromptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new prompt", description = "Create a new prompt (Admin only)")
    public ResponseEntity<PromptDTO> createPrompt(@Valid @RequestBody PromptDTO promptDTO) {
        PromptDTO createdPrompt = promptService.createPrompt(promptDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPrompt);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update prompt", description = "Update an existing prompt (Admin only)")
    public ResponseEntity<PromptDTO> updatePrompt(@PathVariable Long id, @Valid @RequestBody PromptDTO promptDTO) {
        return promptService.updatePrompt(id, promptDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete prompt", description = "Soft delete a prompt (Admin only)")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        boolean deleted = promptService.deletePrompt(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories", description = "Retrieve all available prompt categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(promptService.getAllCategories());
    }

    @GetMapping("/languages")
    @Operation(summary = "Get all languages", description = "Retrieve all available prompt languages")
    public ResponseEntity<List<String>> getAllLanguages() {
        return ResponseEntity.ok(promptService.getAllLanguages());
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular prompts", description = "Retrieve most popular prompts")
    public ResponseEntity<List<PromptDTO>> getPopularPrompts(
            @Parameter(description = "Number of prompts to return") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(promptService.getMostPopularPrompts(limit));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest prompts", description = "Retrieve latest prompts")
    public ResponseEntity<List<PromptDTO>> getLatestPrompts(
            @Parameter(description = "Number of prompts to return") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(promptService.getLatestPrompts(limit));
    }

    @PostMapping("/{id}/copy")
    @Operation(summary = "Increment copy count", description = "Increment the copy count for a prompt")
    public ResponseEntity<Void> incrementCopyCount(@PathVariable Long id) {
        promptService.incrementCopyCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search prompts", description = "Search prompts by text")
    public ResponseEntity<List<PromptDTO>> searchPrompts(
            @Parameter(description = "Search term") @RequestParam String q) {
        return ResponseEntity.ok(promptService.searchPrompts(q));
    }
}
