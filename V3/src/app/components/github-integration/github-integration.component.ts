import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { GitHubIntegrationService, GitHubRepository } from '../../services/github-integration.service';
import { CopilotTemplateService } from '../../services/copilot-template.service';
import { CopilotTemplate } from '../../models/copilot-template.model';

interface IntegrationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

@Component({
  selector: 'app-github-integration',
  templateUrl: './github-integration.component.html',
  styleUrls: ['./github-integration.component.css'],
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
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatSlideToggleModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GitHubIntegrationComponent implements OnInit {
  private githubService = inject(GitHubIntegrationService);
  private templateService = inject(CopilotTemplateService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  // Signals for reactive state management
  isAuthenticated = signal(false);
  isLoading = signal(false);
  repositories = signal<GitHubRepository[]>([]);
  selectedRepo = signal<GitHubRepository | null>(null);
  detectedTechStack = signal<string[]>([]);
  recommendedTemplates = signal<CopilotTemplate[]>([]);
  selectedTemplate = signal<CopilotTemplate | null>(null);

  // Integration steps
  integrationSteps = signal<IntegrationStep[]>([
    { id: 1, title: 'Authenticate', description: 'Connect to your GitHub account', completed: false, current: true },
    { id: 2, title: 'Select Repository', description: 'Choose a repository to integrate', completed: false, current: false },
    { id: 3, title: 'Analyze Tech Stack', description: 'Detect your project\'s technology stack', completed: false, current: false },
    { id: 4, title: 'Choose Template', description: 'Select the best copilot template', completed: false, current: false },
    { id: 5, title: 'Deploy to GitHub', description: 'Create copilot-instructions.md in your repo', completed: false, current: false }
  ]);

  // Forms
  authForm: FormGroup;
  deployForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      accessToken: ['', [Validators.required, Validators.minLength(40)]]
    });

    this.deployForm = this.fb.group({
      commitMessage: ['Add copilot-instructions.md via Copilot Prompter', Validators.required],
      createBranch: [false],
      branchName: ['feature/copilot-instructions'],
      createPR: [false],
      prTitle: ['Add GitHub Copilot Instructions'],
      prDescription: ['This PR adds copilot-instructions.md file to improve GitHub Copilot suggestions for this repository.\n\nGenerated using Copilot Prompter - an AI-powered template management tool.']
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const isAuth = this.githubService.isAuthenticated();
    this.isAuthenticated.set(isAuth);
    
    if (isAuth) {
      this.completeStep(1);
      this.setCurrentStep(2);
      this.loadRepositories();
    }
  }

  authenticate(): void {
    if (this.authForm.valid) {
      this.isLoading.set(true);
      const token = this.authForm.value.accessToken;
      
      this.githubService.setAccessToken(token);
      
      // Verify token by getting user info
      this.githubService.getUserInfo().subscribe({
        next: (user) => {
          this.isAuthenticated.set(true);
          this.completeStep(1);
          this.setCurrentStep(2);
          this.isLoading.set(false);
          this.snackBar.open(`Welcome ${user.login}! GitHub integration successful.`, 'Close', { duration: 5000 });
          this.loadRepositories();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.githubService.clearAccessToken();
          this.snackBar.open('Authentication failed. Please check your access token.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  disconnect(): void {
    this.githubService.clearAccessToken();
    this.isAuthenticated.set(false);
    this.repositories.set([]);
    this.selectedRepo.set(null);
    this.resetSteps();
    this.snackBar.open('Disconnected from GitHub', 'Close', { duration: 3000 });
  }

  loadRepositories(): void {
    this.isLoading.set(true);
    this.githubService.getUserRepositories().subscribe({
      next: (repos) => {
        this.repositories.set(repos);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load repositories', 'Close', { duration: 3000 });
      }
    });
  }

  selectRepository(repo: GitHubRepository): void {
    this.selectedRepo.set(repo);
    this.completeStep(2);
    this.setCurrentStep(3);
    this.analyzeTechStack(repo);
  }

  analyzeTechStack(repo: GitHubRepository): void {
    this.isLoading.set(true);
    this.githubService.analyzeRepositoryTechStack(repo.owner.login, repo.name).subscribe({
      next: (languages) => {
        this.detectedTechStack.set(languages);
        this.completeStep(3);
        this.setCurrentStep(4);
        this.loadRecommendedTemplates(languages);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to analyze tech stack', 'Close', { duration: 3000 });
      }
    });
  }

  loadRecommendedTemplates(languages: string[]): void {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        // Filter templates based on detected languages and frameworks
        const recommended = templates.filter(template => {
          return languages.some(lang => 
            template.language.toLowerCase().includes(lang.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(lang.toLowerCase()))
          );
        }).slice(0, 5); // Get top 5 recommendations

        this.recommendedTemplates.set(recommended);
      },
      error: (error) => {
        this.snackBar.open('Failed to load template recommendations', 'Close', { duration: 3000 });
      }
    });
  }

  selectTemplate(template: CopilotTemplate): void {
    this.selectedTemplate.set(template);
    this.completeStep(4);
    this.setCurrentStep(5);
  }

  deployToGitHub(): void {
    const repo = this.selectedRepo();
    const template = this.selectedTemplate();
    
    if (!repo || !template || !this.deployForm.valid) {
      return;
    }

    this.isLoading.set(true);
    const formValue = this.deployForm.value;

    // Check if file already exists
    this.githubService.checkCopilotInstructions(repo.owner.login, repo.name).subscribe({
      next: (existingFile) => {
        if (formValue.createBranch) {
          this.deployWithBranch(repo, template, formValue, existingFile);
        } else {
          this.deployDirectly(repo, template, formValue, existingFile);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to check existing copilot instructions', 'Close', { duration: 3000 });
      }
    });
  }

  private deployDirectly(repo: GitHubRepository, template: CopilotTemplate, formValue: any, existingFile: any): void {
    this.githubService.createOrUpdateCopilotInstructions(
      repo.owner.login,
      repo.name,
      template.content,
      formValue.commitMessage,
      existingFile?.sha
    ).subscribe({
      next: (response) => {
        this.completeStep(5);
        this.isLoading.set(false);
        this.snackBar.open('Successfully deployed copilot-instructions.md!', 'Close', { duration: 5000 });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to deploy copilot instructions', 'Close', { duration: 5000 });
      }
    });
  }

  private deployWithBranch(repo: GitHubRepository, template: CopilotTemplate, formValue: any, existingFile: any): void {
    const branchName = formValue.branchName || `copilot-instructions-${Date.now()}`;
    
    this.githubService.createBranch(repo.owner.login, repo.name, branchName).subscribe({
      next: (branchResponse) => {
        // Deploy to the new branch
        this.githubService.createOrUpdateCopilotInstructions(
          repo.owner.login,
          repo.name,
          template.content,
          formValue.commitMessage,
          existingFile?.sha
        ).subscribe({
          next: (fileResponse) => {
            if (formValue.createPR) {
              this.createPullRequest(repo, formValue, branchName);
            } else {
              this.completeStep(5);
              this.isLoading.set(false);
              this.snackBar.open(`Successfully created branch ${branchName} with copilot-instructions.md!`, 'Close', { duration: 5000 });
            }
          },
          error: (error) => {
            this.isLoading.set(false);
            this.snackBar.open('Failed to create file in new branch', 'Close', { duration: 5000 });
          }
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to create branch', 'Close', { duration: 5000 });
      }
    });
  }

  private createPullRequest(repo: GitHubRepository, formValue: any, branchName: string): void {
    this.githubService.createPullRequest(
      repo.owner.login,
      repo.name,
      formValue.prTitle,
      formValue.prDescription,
      branchName,
      repo.default_branch
    ).subscribe({
      next: (prResponse) => {
        this.completeStep(5);
        this.isLoading.set(false);
        this.snackBar.open(`Successfully created pull request #${prResponse.number}!`, 'Close', { duration: 5000 });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to create pull request', 'Close', { duration: 5000 });
      }
    });
  }

  private completeStep(stepId: number): void {
    const steps = this.integrationSteps();
    const step = steps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      step.current = false;
      this.integrationSteps.set([...steps]);
    }
  }

  private setCurrentStep(stepId: number): void {
    const steps = this.integrationSteps();
    steps.forEach(step => {
      step.current = step.id === stepId;
    });
    this.integrationSteps.set([...steps]);
  }

  private resetSteps(): void {
    const steps = this.integrationSteps();
    steps.forEach((step, index) => {
      step.completed = false;
      step.current = index === 0;
    });
    this.integrationSteps.set([...steps]);
  }
}
