import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { InMemoryDataService } from './app/services/in-memory-data.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Angular 20 Zoneless Change Detection
    provideZonelessChangeDetection(),
    
    // Enhanced Router with Angular 20 optimizations
    provideRouter(routes, 
      withComponentInputBinding(), // Automatic input binding for route params
      withEnabledBlockingInitialNavigation() // Faster initial navigation
    ),
    
    // HTTP Client with fetch API and performance optimizations
    provideHttpClient(
      withFetch(), // Use native fetch API (faster than XMLHttpRequest)
      withInterceptorsFromDi() // Better performance for interceptors
    ),
    
    // Animations with reduced motion support
    provideAnimations(),
    
    // Import legacy modules for in-memory API and markdown
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      // In-memory Web API for both prompts and templates
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false }),
      MarkdownModule.forRoot()
    )
  ]
}).catch(err => console.error(err));
