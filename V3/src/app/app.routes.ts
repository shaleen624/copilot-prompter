import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard} from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./components/landing/landing.component').then(m => m.LandingComponent),
    title: 'Copilot Prompter - Your AI Assistant Toolkit'
  },
  {
    path: 'logout',
    loadComponent: () => 
      import('./components/logout/logout.component').then(m => m.LogoutComponent),
    title: 'Logged Out - Copilot Prompter'
  },
  {
    path: 'unauthorized',
    loadComponent: () => 
      import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    title: 'Unauthorized Access - Copilot Prompter'
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard - Copilot Prompter'
  },
  {
    path: 'my-submissions',
    loadComponent: () => 
      import('./components/my-submissions/my-submissions.component').then(m => m.MySubmissionsComponent),
    canActivate: [AuthGuard],
    title: 'My Submissions - Copilot Prompter'
  },
  {
    path: 'admin/submissions',
    loadComponent: () => 
      import('./components/admin/submission-dashboard/submission-dashboard.component')
        .then(m => m.SubmissionDashboardComponent),
    canActivate: [AuthGuard, AdminGuard],
    title: 'Submission Dashboard - Admin - Copilot Prompter'
  },
  {
    path: 'submissions/:id',
    loadComponent: () => 
      import('./components/submission-detail/submission-detail.component')
        .then(m => m.SubmissionDetailComponent),
    canActivate: [AuthGuard],
    title: 'Submission Details - Copilot Prompter'
  },
  {
    path: 'prompts',
    loadComponent: () => 
      import('./components/prompt-list/prompt-list.component').then(m => m.PromptListComponent),
    title: 'Prompts - Copilot Prompter'
  },
  {
    path: 'templates',
    loadComponent: () => 
      import('./components/template-gallery/template-gallery.component').then(m => m.TemplateGalleryComponent),
    title: 'Templates - Copilot Prompter'
  },
  {
    path: 'create',
    loadComponent: () => 
      import('./components/prompt-form/prompt-form.component').then(m => m.PromptFormComponent),
    canActivate: [AuthGuard],
    title: 'Create Prompt - Copilot Prompter'
  },
  {
    path: 'templates/create',
    loadComponent: () => 
      import('./components/template-builder/template-builder.component').then(m => m.TemplateBuilderComponent),
    canActivate: [AuthGuard],
    title: 'Create Template - Copilot Prompter'
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Login - Copilot Prompter'
  },
  {
    path: '**',
    loadComponent: () => 
      import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 Not Found - Copilot Prompter'
  }
];