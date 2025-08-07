import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent),
    title: 'Copilot Prompter - Your AI Assistant Toolkit'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Login - Copilot Prompter'
  },
  { 
    path: 'prompts', 
    loadComponent: () => import('./components/prompt-list/prompt-list.component').then(m => m.PromptListComponent),
    title: 'Prompts - Copilot Prompter'
  },
  { 
    path: 'prompts/:id', 
    loadComponent: () => import('./components/prompt-detail/prompt-detail.component').then(m => m.PromptDetailComponent),
    title: 'Prompt Details - Copilot Prompter'
  },
  { 
    path: 'create', 
    loadComponent: () => import('./components/prompt-form/prompt-form.component').then(m => m.PromptFormComponent),
    title: 'Create Prompt - Copilot Prompter'
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./components/prompt-form/prompt-form.component').then(m => m.PromptFormComponent),
    title: 'Edit Prompt - Copilot Prompter'
  },
  // Template routes
  { 
    path: 'templates', 
    loadComponent: () => import('./components/template-gallery/template-gallery.component').then(m => m.TemplateGalleryComponent),
    title: 'Copilot Templates - Copilot Prompter'
  },
  { 
    path: 'templates/create', 
    loadComponent: () => import('./components/template-builder/template-builder.component').then(m => m.TemplateBuilderComponent),
    title: 'Create Template - Copilot Prompter'
  },
  { 
    path: 'templates/edit/:id', 
    loadComponent: () => import('./components/template-builder/template-builder.component').then(m => m.TemplateBuilderComponent),
    title: 'Edit Template - Copilot Prompter'
  },
  { 
    path: 'templates/:id', 
    loadComponent: () => import('./components/template-detail/template-detail.component').then(m => m.TemplateDetailComponent),
    title: 'Template Details - Copilot Prompter'
  },
  // GitHub Integration route
  { 
    path: 'github-integration', 
    loadComponent: () => import('./components/github-integration/github-integration.component').then(m => m.GitHubIntegrationComponent),
    title: 'GitHub Integration - Copilot Prompter'
  },
  // Multi-Provider Integration route
  { 
    path: 'source-control', 
    loadComponent: () => import('./components/multi-provider-integration/multi-provider-integration.component').then(m => m.MultiProviderIntegrationComponent),
    title: 'Source Control Integration - Copilot Prompter'
  },
  // AI Recommendations route
  { 
    path: 'ai-recommendations', 
    loadComponent: () => import('./components/ai-recommendations/ai-recommendations.component').then(m => m.AIRecommendationsComponent),
    title: 'AI Recommendations - Copilot Prompter'
  }
];
