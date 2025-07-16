package com.copilotprompter.repository;

import com.copilotprompter.model.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long> {
    
    List<Prompt> findByActiveTrue();
    
    Page<Prompt> findByActiveTrue(Pageable pageable);
    
    List<Prompt> findByCategoryAndActiveTrue(String category);
    
    List<Prompt> findByLanguageAndActiveTrue(String language);
    
    List<Prompt> findByAuthorAndActiveTrue(String author);
    
    @Query("SELECT p FROM Prompt p WHERE p.active = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.prompt) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Prompt> searchPrompts(@Param("search") String search);
    
    @Query("SELECT p FROM Prompt p WHERE p.active = true AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:language IS NULL OR p.language = :language) AND " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Prompt> findWithFilters(@Param("category") String category,
                                 @Param("language") String language,
                                 @Param("search") String search,
                                 Pageable pageable);
    
    @Query("SELECT DISTINCT p.category FROM Prompt p WHERE p.active = true")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT p.language FROM Prompt p WHERE p.active = true")
    List<String> findAllLanguages();
    
    @Query("SELECT p FROM Prompt p WHERE p.active = true ORDER BY p.viewCount DESC")
    List<Prompt> findMostPopular(Pageable pageable);
    
    @Query("SELECT p FROM Prompt p WHERE p.active = true ORDER BY p.createdAt DESC")
    List<Prompt> findLatest(Pageable pageable);
}
