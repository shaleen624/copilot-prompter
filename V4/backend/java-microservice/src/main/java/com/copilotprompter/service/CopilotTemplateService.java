package com.copilotprompter.service;

import com.copilotprompter.dto.CopilotTemplateDTO;
import com.copilotprompter.model.CopilotTemplate;
import com.copilotprompter.repository.CopilotTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CopilotTemplateService {

    private final CopilotTemplateRepository templateRepository;
    private final MappingService mappingService;

    public List<CopilotTemplateDTO> getAllTemplates() {
        log.info("Fetching all active templates");
        List<CopilotTemplate> templates = templateRepository.findByActiveTrue();
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public Page<CopilotTemplateDTO> getTemplates(Pageable pageable) {
        log.info("Fetching templates with pagination: {}", pageable);
        Page<CopilotTemplate> templatePage = templateRepository.findByActiveTrue(pageable);
        return templatePage.map(mappingService::toCopilotTemplateDTO);
    }

    public Optional<CopilotTemplateDTO> getTemplateById(Long id) {
        log.info("Fetching template by id: {}", id);
        Optional<CopilotTemplate> template = templateRepository.findById(id);
        if (template.isPresent() && template.get().getActive()) {
            // Increment view count
            template.get().setViewCount(template.get().getViewCount() + 1);
            templateRepository.save(template.get());
            return Optional.of(mappingService.toCopilotTemplateDTO(template.get()));
        }
        return Optional.empty();
    }

    public CopilotTemplateDTO createTemplate(CopilotTemplateDTO templateDTO) {
        log.info("Creating new template: {}", templateDTO.getName());
        CopilotTemplate template = mappingService.toCopilotTemplateEntity(templateDTO);
        template.setActive(true);
        template.setViewCount(0L);
        template.setDownloadCount(0L);
        template.setPopularity(0L);
        CopilotTemplate savedTemplate = templateRepository.save(template);
        return mappingService.toCopilotTemplateDTO(savedTemplate);
    }

    public Optional<CopilotTemplateDTO> updateTemplate(Long id, CopilotTemplateDTO templateDTO) {
        log.info("Updating template with id: {}", id);
        return templateRepository.findById(id)
                .filter(template -> template.getActive())
                .map(existingTemplate -> {
                    existingTemplate.setName(templateDTO.getName());
                    existingTemplate.setCategory(templateDTO.getCategory());
                    existingTemplate.setLanguage(templateDTO.getLanguage());
                    existingTemplate.setFramework(templateDTO.getFramework());
                    existingTemplate.setDescription(templateDTO.getDescription());
                    existingTemplate.setContent(templateDTO.getContent());
                    existingTemplate.setTags(templateDTO.getTags());
                    existingTemplate.setAuthor(templateDTO.getAuthor());
                    CopilotTemplate updatedTemplate = templateRepository.save(existingTemplate);
                    return mappingService.toCopilotTemplateDTO(updatedTemplate);
                });
    }

    public boolean deleteTemplate(Long id) {
        log.info("Soft deleting template with id: {}", id);
        return templateRepository.findById(id)
                .map(template -> {
                    template.setActive(false);
                    templateRepository.save(template);
                    return true;
                })
                .orElse(false);
    }

    public List<CopilotTemplateDTO> getTemplatesByCategory(String category) {
        log.info("Fetching templates by category: {}", category);
        List<CopilotTemplate> templates = templateRepository.findByCategoryAndActiveTrue(category);
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public List<CopilotTemplateDTO> getTemplatesByLanguage(String language) {
        log.info("Fetching templates by language: {}", language);
        List<CopilotTemplate> templates = templateRepository.findByLanguageAndActiveTrue(language);
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public List<CopilotTemplateDTO> getTemplatesByFramework(String framework) {
        log.info("Fetching templates by framework: {}", framework);
        List<CopilotTemplate> templates = templateRepository.findByFrameworkAndActiveTrue(framework);
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public List<CopilotTemplateDTO> searchTemplates(String search) {
        log.info("Searching templates with term: {}", search);
        List<CopilotTemplate> templates = templateRepository.searchTemplates(search);
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public Page<CopilotTemplateDTO> getTemplatesWithFilters(String category, String language, String framework, String search, Pageable pageable) {
        log.info("Fetching templates with filters - category: {}, language: {}, framework: {}, search: {}", category, language, framework, search);
        Page<CopilotTemplate> templatePage = templateRepository.findWithFilters(category, language, framework, search, pageable);
        return templatePage.map(mappingService::toCopilotTemplateDTO);
    }

    public List<String> getAllCategories() {
        return templateRepository.findAllCategories();
    }

    public List<String> getAllLanguages() {
        return templateRepository.findAllLanguages();
    }

    public List<String> getAllFrameworks() {
        return templateRepository.findAllFrameworks();
    }

    public List<CopilotTemplateDTO> getMostPopularTemplates(int limit) {
        log.info("Fetching most popular templates, limit: {}", limit);
        List<CopilotTemplate> templates = templateRepository.findMostPopular(Pageable.ofSize(limit));
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public List<CopilotTemplateDTO> getLatestTemplates(int limit) {
        log.info("Fetching latest templates, limit: {}", limit);
        List<CopilotTemplate> templates = templateRepository.findLatest(Pageable.ofSize(limit));
        return templates.stream()
                .map(mappingService::toCopilotTemplateDTO)
                .toList();
    }

    public void incrementDownloadCount(Long id) {
        log.info("Incrementing download count for template: {}", id);
        templateRepository.findById(id)
                .filter(template -> template.getActive())
                .ifPresent(template -> {
                    template.setDownloadCount(template.getDownloadCount() + 1);
                    template.setPopularity(template.getPopularity() + 1);
                    templateRepository.save(template);
                });
    }
}
