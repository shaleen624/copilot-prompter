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
  }
];
