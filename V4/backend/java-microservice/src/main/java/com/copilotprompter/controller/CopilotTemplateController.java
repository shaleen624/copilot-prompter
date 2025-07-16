package com.copilotprompter.controller;

import com.copilotprompter.dto.CopilotTemplateDTO;
import com.copilotprompter.service.CopilotTemplateService;
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
@RequestMapping("/templates")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Templates", description = "Copilot template management endpoints")
public class CopilotTemplateController {

    private final CopilotTemplateService templateService;

    @GetMapping
    @Operation(summary = "Get all templates", description = "Retrieve all active templates with optional pagination")
    public ResponseEntity<Page<CopilotTemplateDTO>> getAllTemplates(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filter by category") @RequestParam(required = false) String category,
            @Parameter(description = "Filter by language") @RequestParam(required = false) String language,
            @Parameter(description = "Filter by framework") @RequestParam(required = false) String framework,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, 
            Sort.Direction.fromString(sortDir), sortBy);

        Page<CopilotTemplateDTO> templates;
        if (category != null || language != null || framework != null || search != null) {
            templates = templateService.getTemplatesWithFilters(category, language, framework, search, pageable);
        } else {
            templates = templateService.getTemplates(pageable);
        }

        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get template by ID", description = "Retrieve a specific template by its ID")
    public ResponseEntity<CopilotTemplateDTO> getTemplateById(@PathVariable Long id) {
        return templateService.getTemplateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new template", description = "Create a new template (Admin only)")
    public ResponseEntity<CopilotTemplateDTO> createTemplate(@Valid @RequestBody CopilotTemplateDTO templateDTO) {
        CopilotTemplateDTO createdTemplate = templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update template", description = "Update an existing template (Admin only)")
    public ResponseEntity<CopilotTemplateDTO> updateTemplate(@PathVariable Long id, 
                                                             @Valid @RequestBody CopilotTemplateDTO templateDTO) {
        return templateService.updateTemplate(id, templateDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete template", description = "Soft delete a template (Admin only)")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        boolean deleted = templateService.deleteTemplate(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories", description = "Retrieve all available template categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(templateService.getAllCategories());
    }

    @GetMapping("/languages")
    @Operation(summary = "Get all languages", description = "Retrieve all available template languages")
    public ResponseEntity<List<String>> getAllLanguages() {
        return ResponseEntity.ok(templateService.getAllLanguages());
    }

    @GetMapping("/frameworks")
    @Operation(summary = "Get all frameworks", description = "Retrieve all available template frameworks")
    public ResponseEntity<List<String>> getAllFrameworks() {
        return ResponseEntity.ok(templateService.getAllFrameworks());
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular templates", description = "Retrieve most popular templates")
    public ResponseEntity<List<CopilotTemplateDTO>> getPopularTemplates(
            @Parameter(description = "Number of templates to return") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(templateService.getMostPopularTemplates(limit));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest templates", description = "Retrieve latest templates")
    public ResponseEntity<List<CopilotTemplateDTO>> getLatestTemplates(
            @Parameter(description = "Number of templates to return") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(templateService.getLatestTemplates(limit));
    }

    @PostMapping("/{id}/download")
    @Operation(summary = "Increment download count", description = "Increment the download count for a template")
    public ResponseEntity<Void> incrementDownloadCount(@PathVariable Long id) {
        templateService.incrementDownloadCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search templates", description = "Search templates by text")
    public ResponseEntity<List<CopilotTemplateDTO>> searchTemplates(
            @Parameter(description = "Search term") @RequestParam String q) {
        return ResponseEntity.ok(templateService.searchTemplates(q));
    }
}
