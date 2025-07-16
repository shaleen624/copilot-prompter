package com.copilotprompter.repository;

import com.copilotprompter.model.CopilotTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CopilotTemplateRepository extends JpaRepository<CopilotTemplate, Long> {
    
    List<CopilotTemplate> findByActiveTrue();
    
    Page<CopilotTemplate> findByActiveTrue(Pageable pageable);
    
    List<CopilotTemplate> findByCategoryAndActiveTrue(String category);
    
    List<CopilotTemplate> findByLanguageAndActiveTrue(String language);
    
    List<CopilotTemplate> findByFrameworkAndActiveTrue(String framework);
    
    List<CopilotTemplate> findByAuthorAndActiveTrue(String author);
    
    @Query("SELECT t FROM CopilotTemplate t WHERE t.active = true AND " +
           "(LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<CopilotTemplate> searchTemplates(@Param("search") String search);
    
    @Query("SELECT t FROM CopilotTemplate t WHERE t.active = true AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:language IS NULL OR t.language = :language) AND " +
           "(:framework IS NULL OR t.framework = :framework) AND " +
           "(:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<CopilotTemplate> findWithFilters(@Param("category") String category,
                                          @Param("language") String language,
                                          @Param("framework") String framework,
                                          @Param("search") String search,
                                          Pageable pageable);
    
    @Query("SELECT DISTINCT t.category FROM CopilotTemplate t WHERE t.active = true")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT t.language FROM CopilotTemplate t WHERE t.active = true")
    List<String> findAllLanguages();
    
    @Query("SELECT DISTINCT t.framework FROM CopilotTemplate t WHERE t.active = true AND t.framework IS NOT NULL")
    List<String> findAllFrameworks();
    
    @Query("SELECT t FROM CopilotTemplate t WHERE t.active = true ORDER BY t.popularity DESC")
    List<CopilotTemplate> findMostPopular(Pageable pageable);
    
    @Query("SELECT t FROM CopilotTemplate t WHERE t.active = true ORDER BY t.createdAt DESC")
    List<CopilotTemplate> findLatest(Pageable pageable);
}
