import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { CopilotAnalyticsService, RepositoryAnalysis } from '../../services/copilot-analytics.service';
import { GitHubIntegrationService } from '../../services/github-integration.service';
import { CopilotTemplateService } from '../../services/copilot-template.service';
import { CopilotTemplate } from '../../models/copilot-template.model';

interface AIRecommendation {
  template: CopilotTemplate;
  matchScore: number;
  reasoning: string[];
  customizations: string[];
}

@Component({
  selector: 'app-ai-recommendations',
  templateUrl: './ai-recommendations.component.html',
  styleUrls: ['./ai-recommendations.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AIRecommendationsComponent implements OnInit {
  private analyticsService = inject(CopilotAnalyticsService);
  private githubService = inject(GitHubIntegrationService);
  private templateService = inject(CopilotTemplateService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals for reactive state
  isLoading = signal(false);
  repositoryAnalysis = signal<RepositoryAnalysis | null>(null);
  recommendations = signal<AIRecommendation[]>([]);
  selectedRecommendation = signal<AIRecommendation | null>(null);
  generatedInstructions = signal<string>('');

  // Form for repository input
  repoForm: FormGroup;

  constructor() {
    this.repoForm = this.fb.group({
      repositoryUrl: [''],
      techStack: [''],
      projectType: [''],
      teamSize: [''],
      complexityLevel: ['']
    });
  }

  ngOnInit(): void {
    // Pre-fill form if coming from GitHub integration
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['repositoryUrl']) {
      this.repoForm.patchValue({
        repositoryUrl: navigation.extras.state['repositoryUrl']
      });
      this.analyzeRepository();
    }
  }

  analyzeRepository(): void {
    const repositoryUrl = this.repoForm.value.repositoryUrl;
    
    if (!repositoryUrl) {
      this.snackBar.open('Please enter a repository URL', 'Close', { duration: 3000 });
      return;
    }

    // Parse GitHub URL
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      this.snackBar.open('Please enter a valid GitHub repository URL', 'Close', { duration: 3000 });
      return;
    }

    const [, owner, repo] = match;
    this.isLoading.set(true);

    this.analyticsService.analyzeRepository(owner, repo.replace('.git', '')).subscribe({
      next: (analysis) => {
        this.repositoryAnalysis.set(analysis);
        this.generateAIRecommendations(analysis);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to analyze repository. Please check the URL and try again.', 'Close', { duration: 5000 });
      }
    });
  }

  analyzeManualInput(): void {
    const formValue = this.repoForm.value;
    
    if (!formValue.techStack) {
      this.snackBar.open('Please specify your technology stack', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);

    // Create mock analysis from form input
    const mockAnalysis: RepositoryAnalysis = {
      techStack: formValue.techStack.split(',').map((tech: string) => tech.trim()),
      complexity: formValue.complexityLevel || 'medium',
      recommendedTemplates: [],
      codeQualityScore: 75,
      securityIssues: [],
      performanceInsights: []
    };

    // Simulate API delay
    setTimeout(() => {
      this.repositoryAnalysis.set(mockAnalysis);
      this.generateAIRecommendations(mockAnalysis);
      this.isLoading.set(false);
    }, 1500);
  }

  private generateAIRecommendations(analysis: RepositoryAnalysis): void {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        const recommendations = this.scoreAndRankTemplates(templates, analysis);
        this.recommendations.set(recommendations);
        
        if (recommendations.length > 0) {
          this.selectRecommendation(recommendations[0]);
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to load template recommendations', 'Close', { duration: 3000 });
      }
    });
  }

  private scoreAndRankTemplates(templates: CopilotTemplate[], analysis: RepositoryAnalysis): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    templates.forEach(template => {
      const score = this.calculateMatchScore(template, analysis);
      
      if (score > 0.3) { // Only include templates with significant match
        const reasoning = this.generateReasoning(template, analysis);
        const customizations = this.suggestCustomizations(template, analysis);
        
        recommendations.push({
          template,
          matchScore: score,
          reasoning,
          customizations
        });
      }
    });

    // Sort by match score (highest first)
    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }

  private calculateMatchScore(template: CopilotTemplate, analysis: RepositoryAnalysis): number {
    let score = 0;

    // Language match
    const templateLang = template.language.toLowerCase();
    const hasLangMatch = analysis.techStack.some(tech => 
      tech.toLowerCase().includes(templateLang) || templateLang.includes(tech.toLowerCase())
    );
    if (hasLangMatch) score += 0.4;

    // Framework match
    if (template.framework) {
      const hasFrameworkMatch = analysis.techStack.some(tech =>
        tech.toLowerCase().includes(template.framework!.toLowerCase()) ||
        template.framework!.toLowerCase().includes(tech.toLowerCase())
      );
      if (hasFrameworkMatch) score += 0.3;
    }

    // Category relevance
    const categoryMatches = {
      'Frontend Framework': analysis.techStack.some(tech => 
        ['react', 'angular', 'vue', 'svelte', 'html', 'css', 'javascript', 'typescript'].includes(tech.toLowerCase())
      ),
      'Backend Framework': analysis.techStack.some(tech =>
        ['node', 'express', 'fastapi', 'django', 'spring', 'asp.net'].includes(tech.toLowerCase())
      ),
      'Mobile Development': analysis.techStack.some(tech =>
        ['swift', 'kotlin', 'react native', 'flutter', 'dart'].includes(tech.toLowerCase())
      )
    };

    if (categoryMatches[template.category as keyof typeof categoryMatches]) {
      score += 0.2;
    }

    // Complexity match
    const complexityBonus = {
      'simple': template.tags.includes('beginner') ? 0.1 : 0,
      'medium': template.tags.includes('intermediate') ? 0.1 : 0,
      'complex': template.tags.includes('advanced') || template.tags.includes('enterprise') ? 0.1 : 0
    };
    score += complexityBonus[analysis.complexity] || 0;

    return Math.min(1, score);
  }

  private generateReasoning(template: CopilotTemplate, analysis: RepositoryAnalysis): string[] {
    const reasons: string[] = [];

    // Language alignment
    if (analysis.techStack.some(tech => tech.toLowerCase().includes(template.language.toLowerCase()))) {
      reasons.push(`Matches your ${template.language} codebase`);
    }

    // Framework alignment
    if (template.framework && analysis.techStack.some(tech => 
      tech.toLowerCase().includes(template.framework!.toLowerCase())
    )) {
      reasons.push(`Optimized for ${template.framework} development`);
    }

    // Complexity appropriateness
    const complexityMap = {
      'simple': 'perfect for straightforward projects',
      'medium': 'well-suited for moderately complex applications',
      'complex': 'designed for enterprise-scale applications'
    };
    reasons.push(`Template complexity ${complexityMap[analysis.complexity]}`);

    // Quality score consideration
    if (analysis.codeQualityScore < 70) {
      reasons.push('Includes quality improvement guidelines');
    }

    // Security focus
    if (analysis.securityIssues.length > 0) {
      reasons.push('Addresses security best practices');
    }

    return reasons;
  }

  private suggestCustomizations(template: CopilotTemplate, analysis: RepositoryAnalysis): string[] {
    const customizations: string[] = [];

    // Security customizations
    if (analysis.securityIssues.length > 0) {
      customizations.push('Add security-specific guidelines for your tech stack');
    }

    // Performance customizations
    if (analysis.performanceInsights.length > 0) {
      customizations.push('Include performance optimization patterns');
    }

    // Language-specific customizations
    analysis.techStack.forEach(tech => {
      const techLower = tech.toLowerCase();
      if (techLower.includes('typescript') && !template.content.includes('TypeScript')) {
        customizations.push('Add TypeScript-specific type safety guidelines');
      }
      if (techLower.includes('react') && !template.content.includes('React')) {
        customizations.push('Include React hooks and component patterns');
      }
      if (techLower.includes('angular') && !template.content.includes('Angular')) {
        customizations.push('Add Angular-specific dependency injection patterns');
      }
    });

    // Complexity-based customizations
    if (analysis.complexity === 'complex') {
      customizations.push('Add enterprise patterns and scalability guidelines');
    }

    return customizations;
  }

  selectRecommendation(recommendation: AIRecommendation): void {
    this.selectedRecommendation.set(recommendation);
    
    // Generate personalized instructions
    const analysis = this.repositoryAnalysis();
    if (analysis) {
      const personalizedInstructions = this.analyticsService.generatePersonalizedInstructions(analysis);
      
      // Merge with template content
      const mergedInstructions = this.mergeInstructions(recommendation.template.content, personalizedInstructions);
      this.generatedInstructions.set(mergedInstructions);
    }
  }

  private mergeInstructions(templateContent: string, personalizedContent: string): string {
    // Intelligent merging of template and personalized instructions
    let merged = templateContent;
    
    // Add personalized context at the beginning
    if (!merged.includes('## Project Context')) {
      const contextSection = personalizedContent.match(/## Project Context[\s\S]*?(?=##|$)/)?.[0];
      if (contextSection) {
        merged = merged.replace(/^(# .*\n\n)/, `$1${contextSection}\n\n`);
      }
    }

    // Add any unique sections from personalized content
    const personalizedSections = personalizedContent.match(/## [^#\n]+[\s\S]*?(?=##|$)/g) || [];
    personalizedSections.forEach(section => {
      const sectionTitle = section.match(/## ([^#\n]+)/)?.[1];
      if (sectionTitle && !merged.includes(`## ${sectionTitle}`)) {
        merged += `\n\n${section}`;
      }
    });

    return merged;
  }

  useRecommendation(): void {
    const recommendation = this.selectedRecommendation();
    if (recommendation) {
      // Navigate to GitHub integration with pre-selected template and instructions
      this.router.navigate(['/github-integration'], {
        state: {
          selectedTemplate: recommendation.template,
          customInstructions: this.generatedInstructions(),
          analysisData: this.repositoryAnalysis()
        }
      });
    }
  }

  createCustomTemplate(): void {
    const instructions = this.generatedInstructions();
    if (instructions) {
      // Navigate to template builder with pre-filled content
      this.router.navigate(['/templates/create'], {
        state: {
          prefilledContent: instructions,
          analysisData: this.repositoryAnalysis()
        }
      });
    }
  }

  copyInstructions(): void {
    const instructions = this.generatedInstructions();
    if (instructions) {
      navigator.clipboard.writeText(instructions).then(() => {
        this.snackBar.open('Personalized instructions copied to clipboard!', 'Close', { duration: 3000 });
      });
    }
  }

  getComplexityColor(complexity: string): 'primary' | 'accent' | 'warn' {
    switch (complexity) {
      case 'simple': return 'primary';
      case 'medium': return 'accent';
      case 'complex': return 'warn';
      default: return 'primary';
    }
  }

  getQualityColor(score: number): 'primary' | 'accent' | 'warn' {
    if (score >= 80) return 'primary';
    if (score >= 60) return 'accent';
    return 'warn';
  }

  getScoreColor(score: number): string {
    if (score >= 0.8) return 'linear-gradient(135deg, #4caf50, #45a049)';
    if (score >= 0.6) return 'linear-gradient(135deg, #ff9800, #f57c00)';
    return 'linear-gradient(135deg, #ff5722, #e64a19)';
  }
}
