import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CopilotTemplate, CopilotTemplateBuilder } from '../models/copilot-template.model';

@Injectable({
  providedIn: 'root'
})
export class CopilotTemplateService {
  private http = inject(HttpClient);
  private templatesUrl = 'api/copilotTemplates';  // URL to web api from separate template service

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getTemplates(): Observable<CopilotTemplate[]> {
    return this.http.get<CopilotTemplate[]>(this.templatesUrl)
      .pipe(
        tap(_ => console.log('fetched copilot templates')),
        catchError(this.handleError<CopilotTemplate[]>('getTemplates', []))
      );
  }

  getTemplate(id: string): Observable<CopilotTemplate> {
    const url = `${this.templatesUrl}/${id}`;
    return this.http.get<CopilotTemplate>(url).pipe(
      tap(_ => console.log(`fetched template id=${id}`)),
      catchError(this.handleError<CopilotTemplate>(`getTemplate id=${id}`))
    );
  }

  getTemplatesByCategory(category: string): Observable<CopilotTemplate[]> {
    return this.http.get<CopilotTemplate[]>(`${this.templatesUrl}?category=${category}`)
      .pipe(
        tap(_ => console.log(`fetched templates for category=${category}`)),
        catchError(this.handleError<CopilotTemplate[]>('getTemplatesByCategory', []))
      );
  }

  getTemplatesByLanguage(language: string): Observable<CopilotTemplate[]> {
    return this.http.get<CopilotTemplate[]>(`${this.templatesUrl}?language=${language}`)
      .pipe(
        tap(_ => console.log(`fetched templates for language=${language}`)),
        catchError(this.handleError<CopilotTemplate[]>('getTemplatesByLanguage', []))
      );
  }

  addTemplate(template: CopilotTemplate): Observable<CopilotTemplate> {
    return this.http.post<CopilotTemplate>(this.templatesUrl, template, this.httpOptions).pipe(
      tap((newTemplate: CopilotTemplate) => console.log(`added template w/ id=${newTemplate.id}`)),
      catchError(this.handleError<CopilotTemplate>('addTemplate'))
    );
  }

  updateTemplate(template: CopilotTemplate): Observable<any> {
    return this.http.put(this.templatesUrl, template, this.httpOptions).pipe(
      tap(_ => console.log(`updated template id=${template.id}`)),
      catchError(this.handleError<any>('updateTemplate'))
    );
  }

  buildTemplateFromForm(builder: CopilotTemplateBuilder): string {
    let content = '# Copilot Instructions\n\n';
    
    if (builder.projectContext) {
      content += `## Project Context\n${builder.projectContext}\n\n`;
    }

    if (builder.codingStandards.length > 0) {
      content += '## Coding Standards\n';
      builder.codingStandards.forEach(standard => {
        content += `- ${standard}\n`;
      });
      content += '\n';
    }

    if (builder.architectureGuidelines.length > 0) {
      content += '## Architecture Guidelines\n';
      builder.architectureGuidelines.forEach(guideline => {
        content += `- ${guideline}\n`;
      });
      content += '\n';
    }

    if (builder.frameworkRules.length > 0) {
      content += '## Framework-Specific Rules\n';
      builder.frameworkRules.forEach(rule => {
        content += `- ${rule}\n`;
      });
      content += '\n';
    }

    if (builder.fileStructure) {
      content += `## File Structure\n${builder.fileStructure}\n\n`;
    }

    if (builder.testingPreferences.length > 0) {
      content += '## Testing Preferences\n';
      builder.testingPreferences.forEach(preference => {
        content += `- ${preference}\n`;
      });
      content += '\n';
    }

    if (builder.customSections.length > 0) {
      builder.customSections
        .sort((a, b) => a.order - b.order)
        .forEach(section => {
          content += `## ${section.title}\n${section.content}\n\n`;
        });
    }

    return content;
  }

  mergeTemplates(templateIds: string[]): Observable<string> {
    // This would typically call an API to merge templates
    // For now, return a simple merged content
    return of('# Merged Copilot Instructions\n\n<!-- Multiple templates merged -->\n');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);
      return of(result as T);
    };
  }
}
