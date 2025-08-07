import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { SourceControlService, UnifiedRepository, SourceControlProvider } from '../../services/source-control.service';
import { CopilotTemplateService } from '../../services/copilot-template.service';
import { CopilotAnalyticsService } from '../../services/copilot-analytics.service';
import { CopilotTemplate } from '../../models/copilot-template.model';

interface RepositoryAnalysis {
  languages: string[];
  complexity: 'simple' | 'medium' | 'complex';
  qualityScore: number;
  recommendations: string[];
  suggestedTemplates: CopilotTemplate[];
}

@Component({
  selector: 'app-multi-provider-integration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './multi-provider-integration.component.html',
  styleUrls: ['./multi-provider-integration.component.css']
})
export class MultiProviderIntegrationComponent implements OnInit {
  public sourceControlService = inject(SourceControlService);
  private templateService = inject(CopilotTemplateService);
  private analyticsService = inject(CopilotAnalyticsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Authentication forms
  githubAuthForm: FormGroup;
  bitbucketAuthForm: FormGroup;
  bitbucketTokenForm: FormGroup;

  // Signals for reactive state management
  availableProviders = signal<SourceControlProvider[]>([]);
  selectedProvider = signal<SourceControlProvider | null>(null);
  repositories = signal<UnifiedRepository[]>([]);
  selectedRepository = signal<UnifiedRepository | null>(null);
  repositoryAnalysis = signal<RepositoryAnalysis | null>(null);
  selectedTemplate = signal<CopilotTemplate | null>(null);
  
  // Loading states
  isLoadingRepos = signal(false);
  isAnalyzing = signal(false);
  isDeploying = signal(false);

  // Computed properties
  isAuthenticated = computed(() => this.sourceControlService.isAuthenticated());
  hasMultipleProviders = computed(() => this.availableProviders().length > 1);
  canProceedToRepos = computed(() => this.selectedProvider() !== null);
  canAnalyze = computed(() => this.selectedRepository() !== null);
  canSelectTemplate = computed(() => this.repositoryAnalysis() !== null);
  canDeploy = computed(() => this.selectedTemplate() !== null);

  constructor() {
    this.githubAuthForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(40)]]
    });

    this.bitbucketAuthForm = this.fb.group({
      username: ['', [Validators.required]],
      appPassword: ['', [Validators.required]]
    });

    this.bitbucketTokenForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit() {
    this.updateAvailableProviders();
    
    // Auto-select provider if only one is available
    const providers = this.availableProviders();
    if (providers.length === 1) {
      this.selectedProvider.set(providers[0]);
    }
  }

  private updateAvailableProviders() {
    // Show all possible providers, not just authenticated ones
    this.availableProviders.set(['github', 'bitbucket']);
  }

  /**
   * Authenticate with GitHub
   */
  authenticateGitHub() {
    if (this.githubAuthForm.valid) {
      const token = this.githubAuthForm.value.token;
      const githubService = this.sourceControlService.getAuthService('github');
      
      if ('setAccessToken' in githubService) {
        githubService.setAccessToken(token);
        this.updateAvailableProviders();
        this.snackBar.open('GitHub authentication successful!', 'Close', { duration: 3000 });
        
        // Auto-select GitHub if it's the only provider
        if (this.availableProviders().length === 1) {
          this.selectedProvider.set('github');
        }
      }
    }
  }

  /**
   * Authenticate with Bitbucket
   */
  authenticateBitbucket() {
    if (this.bitbucketAuthForm.valid) {
      const { username, appPassword } = this.bitbucketAuthForm.value;
      const bitbucketService = this.sourceControlService.getAuthService('bitbucket');
      
      if ('setCredentials' in bitbucketService) {
        bitbucketService.setCredentials(username, appPassword);
        this.updateAvailableProviders();
        this.snackBar.open('Bitbucket authentication successful!', 'Close', { duration: 3000 });
        
        // Auto-select Bitbucket if it's the only provider
        if (this.availableProviders().length === 1) {
          this.selectedProvider.set('bitbucket');
        }
      }
    }
  }

  /**
   * Authenticate with Bitbucket using Personal Access Token
   */
  authenticateBitbucketWithToken() {
    if (this.bitbucketTokenForm.valid) {
      const token = this.bitbucketTokenForm.value.token;
      const bitbucketService = this.sourceControlService.getAuthService('bitbucket');
      
      if ('setPersonalAccessToken' in bitbucketService) {
        bitbucketService.setPersonalAccessToken(token);
        this.updateAvailableProviders();
        this.snackBar.open('Bitbucket token authentication successful!', 'Close', { duration: 3000 });
        
        // Auto-select Bitbucket if it's the only provider
        if (this.availableProviders().length === 1) {
          this.selectedProvider.set('bitbucket');
        }
      }
    }
  }

  /**
   * Select a source control provider
   */
  selectProvider(provider: SourceControlProvider) {
    this.selectedProvider.set(provider);
    this.loadRepositories();
  }

  /**
   * Load repositories from the selected provider
   */
  loadRepositories() {
    const provider = this.selectedProvider();
    if (!provider) return;

    this.isLoadingRepos.set(true);
    this.sourceControlService.getRepositories(provider).subscribe({
      next: (repos) => {
        this.repositories.set(repos);
        this.isLoadingRepos.set(false);
      },
      error: (error) => {
        console.error('Error loading repositories:', error);
        this.snackBar.open('Failed to load repositories. Please check your credentials.', 'Close', { 
          duration: 5000 
        });
        this.isLoadingRepos.set(false);
      }
    });
  }

  /**
   * Select a repository for analysis
   */
  selectRepository(repo: UnifiedRepository) {
    this.selectedRepository.set(repo);
    this.analyzeRepository();
  }

  /**
   * Analyze the selected repository
   */
  analyzeRepository() {
    const repo = this.selectedRepository();
    if (!repo) return;

    this.isAnalyzing.set(true);
    
    // Get tech stack analysis
    this.sourceControlService.analyzeRepositoryTechStack(repo).subscribe({
      next: (languages) => {
        // Create a basic analysis structure
        const analysis = {
          complexity: this.determineComplexity(languages),
          qualityScore: this.calculateQualityScore(languages),
          recommendations: this.generateRecommendations(languages)
        };

        // Get template recommendations based on languages
        this.templateService.getTemplates().subscribe({
          next: (templates) => {
            const suggestedTemplates = this.getSuggestedTemplates(templates, languages);
            
            const repositoryAnalysis: RepositoryAnalysis = {
              languages,
              complexity: analysis.complexity,
              qualityScore: analysis.qualityScore,
              recommendations: analysis.recommendations,
              suggestedTemplates
            };
            
            this.repositoryAnalysis.set(repositoryAnalysis);
            this.isAnalyzing.set(false);
          },
          error: (error) => {
            console.error('Error loading templates:', error);
            this.isAnalyzing.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error analyzing repository:', error);
        this.snackBar.open('Failed to analyze repository.', 'Close', { duration: 3000 });
        this.isAnalyzing.set(false);
      }
    });
  }

  /**
   * Select a template for deployment
   */
  selectTemplate(template: CopilotTemplate) {
    this.selectedTemplate.set(template);
  }

  /**
   * Deploy the selected template to the repository
   */
  deployTemplate() {
    const repo = this.selectedRepository();
    const template = this.selectedTemplate();
    const analysis = this.repositoryAnalysis();
    
    if (!repo || !template || !analysis) return;

    this.isDeploying.set(true);

    // Generate personalized instructions using template content
    const personalizedInstructions = template.content + '\n\n' + 
      `// Detected technologies: ${analysis.languages.join(', ')}\n` +
      `// Recommendations: ${analysis.recommendations.join('; ')}`;

    // Check if instructions already exist
    this.sourceControlService.checkCopilotInstructions(repo).subscribe({
      next: (existingFile) => {
        const message = existingFile 
          ? `Update copilot-instructions.md with ${template.name} template`
          : `Add copilot-instructions.md with ${template.name} template`;

        // Create or update the file
        this.sourceControlService.createOrUpdateCopilotInstructions(
          repo,
          personalizedInstructions,
          message,
          existingFile || undefined
        ).subscribe({
          next: (response) => {
            this.snackBar.open(
              `Successfully deployed ${template.name} to ${repo.name} on ${repo.provider}!`, 
              'Close', 
              { duration: 5000 }
            );
            this.isDeploying.set(false);
            
            // Optionally navigate to template detail
            this.router.navigate(['/templates', template.id]);
          },
          error: (error) => {
            console.error('Error deploying template:', error);
            this.snackBar.open('Failed to deploy template. Please try again.', 'Close', { 
              duration: 5000 
            });
            this.isDeploying.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error checking existing instructions:', error);
        this.isDeploying.set(false);
      }
    });
  }

  /**
   * Reset the integration flow
   */
  reset() {
    this.selectedProvider.set(null);
    this.repositories.set([]);
    this.selectedRepository.set(null);
    this.repositoryAnalysis.set(null);
    this.selectedTemplate.set(null);
  }

  /**
   * Logout from a specific provider
   */
  logout(provider: SourceControlProvider) {
    const authService = this.sourceControlService.getAuthService(provider);
    
    if (provider === 'github' && 'clearAccessToken' in authService) {
      authService.clearAccessToken();
    } else if (provider === 'bitbucket' && 'clearCredentials' in authService) {
      authService.clearCredentials();
    }
    
    this.updateAvailableProviders();
    this.reset();
    this.snackBar.open(`Logged out from ${provider}`, 'Close', { duration: 3000 });
  }

  /**
   * Get template suggestions based on detected languages
   */
  private getSuggestedTemplates(templates: CopilotTemplate[], languages: string[]): CopilotTemplate[] {
    return templates
      .filter(template => {
        // Match templates based on detected languages
        return languages.some(lang => 
          template.content.toLowerCase().includes(lang.toLowerCase()) ||
          template.name.toLowerCase().includes(lang.toLowerCase()) ||
          template.description.toLowerCase().includes(lang.toLowerCase())
        );
      })
      .slice(0, 5); // Limit to top 5 suggestions
  }

  /**
   * Determine complexity based on languages
   */
  private determineComplexity(languages: string[]): 'simple' | 'medium' | 'complex' {
    if (languages.length <= 2) return 'simple';
    if (languages.length <= 4) return 'medium';
    return 'complex';
  }

  /**
   * Calculate quality score based on languages
   */
  private calculateQualityScore(languages: string[]): number {
    // Simple scoring based on modern tech stack presence
    const modernLanguages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'];
    const modernCount = languages.filter(lang => modernLanguages.includes(lang)).length;
    return Math.min(100, (modernCount / languages.length) * 100);
  }

  /**
   * Generate recommendations based on languages
   */
  private generateRecommendations(languages: string[]): string[] {
    const recommendations: string[] = [];
    
    if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
      recommendations.push('Consider using modern ES6+ features and TypeScript for better code quality');
    }
    
    if (languages.includes('Python')) {
      recommendations.push('Follow PEP 8 style guide and use type hints');
    }
    
    if (languages.length > 3) {
      recommendations.push('Consider breaking down into smaller, focused modules');
    }
    
    return recommendations;
  }

  /**
   * Get icon for provider
   */
  getProviderIcon(provider: SourceControlProvider): string {
    switch (provider) {
      case 'github': return 'code';
      case 'bitbucket': return 'source';
      default: return 'cloud';
    }
  }

  /**
   * Get display name for provider
   */
  getProviderDisplayName(provider: SourceControlProvider): string {
    switch (provider) {
      case 'github': return 'GitHub';
      case 'bitbucket': return 'Bitbucket';
      default: return provider;
    }
  }

  /**
   * Get complexity color for mat-chip
   */
  getComplexityColor(complexity: string): 'primary' | 'accent' | 'warn' {
    switch (complexity) {
      case 'simple': return 'primary';
      case 'medium': return 'accent';
      case 'complex': return 'warn';
      default: return 'primary';
    }
  }
}
