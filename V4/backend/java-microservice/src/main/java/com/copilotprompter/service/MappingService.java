package com.copilotprompter.service;

import com.copilotprompter.dto.CopilotTemplateDTO;
import com.copilotprompter.dto.PromptDTO;
import com.copilotprompter.dto.UserDTO;
import com.copilotprompter.model.CopilotTemplate;
import com.copilotprompter.model.Prompt;
import com.copilotprompter.model.User;
import org.springframework.stereotype.Service;

@Service
public class MappingService {

    public PromptDTO toPromptDTO(Prompt prompt) {
        PromptDTO dto = new PromptDTO();
        dto.setId(prompt.getId());
        dto.setTitle(prompt.getTitle());
        dto.setPrompt(prompt.getPrompt());
        dto.setDescription(prompt.getDescription());
        dto.setTags(prompt.getTags());
        dto.setCategory(prompt.getCategory());
        dto.setLanguage(prompt.getLanguage());
        dto.setAuthor(prompt.getAuthor());
        dto.setCreatedAt(prompt.getCreatedAt());
        dto.setUpdatedAt(prompt.getUpdatedAt());
        dto.setActive(prompt.getActive());
        dto.setViewCount(prompt.getViewCount());
        dto.setCopyCount(prompt.getCopyCount());
        return dto;
    }

    public Prompt toPromptEntity(PromptDTO dto) {
        Prompt prompt = new Prompt();
        prompt.setId(dto.getId());
        prompt.setTitle(dto.getTitle());
        prompt.setPrompt(dto.getPrompt());
        prompt.setDescription(dto.getDescription());
        prompt.setTags(dto.getTags());
        prompt.setCategory(dto.getCategory());
        prompt.setLanguage(dto.getLanguage());
        prompt.setAuthor(dto.getAuthor());
        prompt.setActive(dto.getActive());
        prompt.setViewCount(dto.getViewCount() != null ? dto.getViewCount() : 0L);
        prompt.setCopyCount(dto.getCopyCount() != null ? dto.getCopyCount() : 0L);
        return prompt;
    }

    public CopilotTemplateDTO toCopilotTemplateDTO(CopilotTemplate template) {
        CopilotTemplateDTO dto = new CopilotTemplateDTO();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setCategory(template.getCategory());
        dto.setLanguage(template.getLanguage());
        dto.setFramework(template.getFramework());
        dto.setDescription(template.getDescription());
        dto.setContent(template.getContent());
        dto.setTags(template.getTags());
        dto.setPopularity(template.getPopularity());
        dto.setAuthor(template.getAuthor());
        dto.setCreatedAt(template.getCreatedAt());
        dto.setLastUpdated(template.getLastUpdated());
        dto.setActive(template.getActive());
        dto.setViewCount(template.getViewCount());
        dto.setDownloadCount(template.getDownloadCount());
        return dto;
    }

    public CopilotTemplate toCopilotTemplateEntity(CopilotTemplateDTO dto) {
        CopilotTemplate template = new CopilotTemplate();
        template.setId(dto.getId());
        template.setName(dto.getName());
        template.setCategory(dto.getCategory());
        template.setLanguage(dto.getLanguage());
        template.setFramework(dto.getFramework());
        template.setDescription(dto.getDescription());
        template.setContent(dto.getContent());
        template.setTags(dto.getTags());
        template.setPopularity(dto.getPopularity() != null ? dto.getPopularity() : 0L);
        template.setAuthor(dto.getAuthor());
        template.setActive(dto.getActive());
        template.setViewCount(dto.getViewCount() != null ? dto.getViewCount() : 0L);
        template.setDownloadCount(dto.getDownloadCount() != null ? dto.getDownloadCount() : 0L);
        return template;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.getEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setLastLoginAt(user.getLastLoginAt());
        return dto;
    }

    public User toUserEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        if (dto.getRole() != null) {
            user.setRole(User.Role.valueOf(dto.getRole()));
        }
        user.setEnabled(dto.getEnabled());
        return user;
    }
}
