import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/prompts', pathMatch: 'full' },
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
  }
];
