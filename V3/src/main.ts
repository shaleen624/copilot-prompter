import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { InMemoryDataService } from './app/services/in-memory-data.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MarkdownModule.forRoot(),
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { 
        delay: 500,
        dataEncapsulation: false 
      })
    )
  ]
}).catch((error: Error) => {
  console.error('Application bootstrap failed:', error);
});
