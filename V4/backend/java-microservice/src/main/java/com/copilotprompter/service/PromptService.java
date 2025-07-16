package com.copilotprompter.service;

import com.copilotprompter.dto.PromptDTO;
import com.copilotprompter.model.Prompt;
import com.copilotprompter.repository.PromptRepository;
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
public class PromptService {

    private final PromptRepository promptRepository;
    private final MappingService mappingService;

    public List<PromptDTO> getAllPrompts() {
        log.info("Fetching all active prompts");
        List<Prompt> prompts = promptRepository.findByActiveTrue();
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public Page<PromptDTO> getPrompts(Pageable pageable) {
        log.info("Fetching prompts with pagination: {}", pageable);
        Page<Prompt> promptPage = promptRepository.findByActiveTrue(pageable);
        return promptPage.map(mappingService::toPromptDTO);
    }

    public Optional<PromptDTO> getPromptById(Long id) {
        log.info("Fetching prompt by id: {}", id);
        Optional<Prompt> prompt = promptRepository.findById(id);
        if (prompt.isPresent() && prompt.get().getActive()) {
            // Increment view count
            prompt.get().setViewCount(prompt.get().getViewCount() + 1);
            promptRepository.save(prompt.get());
            return Optional.of(mappingService.toPromptDTO(prompt.get()));
        }
        return Optional.empty();
    }

    public PromptDTO createPrompt(PromptDTO promptDTO) {
        log.info("Creating new prompt: {}", promptDTO.getTitle());
        Prompt prompt = mappingService.toPromptEntity(promptDTO);
        prompt.setActive(true);
        prompt.setViewCount(0L);
        prompt.setCopyCount(0L);
        Prompt savedPrompt = promptRepository.save(prompt);
        return mappingService.toPromptDTO(savedPrompt);
    }

    public Optional<PromptDTO> updatePrompt(Long id, PromptDTO promptDTO) {
        log.info("Updating prompt with id: {}", id);
        return promptRepository.findById(id)
                .filter(prompt -> prompt.getActive())
                .map(existingPrompt -> {
                    existingPrompt.setTitle(promptDTO.getTitle());
                    existingPrompt.setPrompt(promptDTO.getPrompt());
                    existingPrompt.setDescription(promptDTO.getDescription());
                    existingPrompt.setTags(promptDTO.getTags());
                    existingPrompt.setCategory(promptDTO.getCategory());
                    existingPrompt.setLanguage(promptDTO.getLanguage());
                    existingPrompt.setAuthor(promptDTO.getAuthor());
                    Prompt updatedPrompt = promptRepository.save(existingPrompt);
                    return mappingService.toPromptDTO(updatedPrompt);
                });
    }

    public boolean deletePrompt(Long id) {
        log.info("Soft deleting prompt with id: {}", id);
        return promptRepository.findById(id)
                .map(prompt -> {
                    prompt.setActive(false);
                    promptRepository.save(prompt);
                    return true;
                })
                .orElse(false);
    }

    public List<PromptDTO> getPromptsByCategory(String category) {
        log.info("Fetching prompts by category: {}", category);
        List<Prompt> prompts = promptRepository.findByCategoryAndActiveTrue(category);
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public List<PromptDTO> getPromptsByLanguage(String language) {
        log.info("Fetching prompts by language: {}", language);
        List<Prompt> prompts = promptRepository.findByLanguageAndActiveTrue(language);
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public List<PromptDTO> searchPrompts(String search) {
        log.info("Searching prompts with term: {}", search);
        List<Prompt> prompts = promptRepository.searchPrompts(search);
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public Page<PromptDTO> getPromptsWithFilters(String category, String language, String search, Pageable pageable) {
        log.info("Fetching prompts with filters - category: {}, language: {}, search: {}", category, language, search);
        Page<Prompt> promptPage = promptRepository.findWithFilters(category, language, search, pageable);
        return promptPage.map(mappingService::toPromptDTO);
    }

    public List<String> getAllCategories() {
        return promptRepository.findAllCategories();
    }

    public List<String> getAllLanguages() {
        return promptRepository.findAllLanguages();
    }

    public List<PromptDTO> getMostPopularPrompts(int limit) {
        log.info("Fetching most popular prompts, limit: {}", limit);
        List<Prompt> prompts = promptRepository.findMostPopular(Pageable.ofSize(limit));
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public List<PromptDTO> getLatestPrompts(int limit) {
        log.info("Fetching latest prompts, limit: {}", limit);
        List<Prompt> prompts = promptRepository.findLatest(Pageable.ofSize(limit));
        return prompts.stream()
                .map(mappingService::toPromptDTO)
                .toList();
    }

    public void incrementCopyCount(Long id) {
        log.info("Incrementing copy count for prompt: {}", id);
        promptRepository.findById(id)
                .filter(prompt -> prompt.getActive())
                .ifPresent(prompt -> {
                    prompt.setCopyCount(prompt.getCopyCount() + 1);
                    promptRepository.save(prompt);
                });
    }
}
