import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { CopilotTemplate, COPILOT_TEMPLATE_CATEGORIES, COPILOT_TEMPLATE_LANGUAGES, COPILOT_TEMPLATE_FRAMEWORKS } from '../../models/copilot-template.model';
import { CopilotTemplateService } from '../../services/copilot-template.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-template-gallery',
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatChipsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './template-gallery.component.html',
  styleUrls: ['./template-gallery.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateGalleryComponent implements OnInit {
  private router = inject(Router);
  private templateService = inject(CopilotTemplateService);
  
  templates$ = new BehaviorSubject<CopilotTemplate[]>([]);
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  languageControl = new FormControl('');
  frameworkControl = new FormControl('');

  categories: string[] = COPILOT_TEMPLATE_CATEGORIES;
  languages: string[] = COPILOT_TEMPLATE_LANGUAGES;
  frameworks: string[] = COPILOT_TEMPLATE_FRAMEWORKS;

  filteredTemplates$: Observable<CopilotTemplate[]> = combineLatest([
    this.templates$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.categoryControl.valueChanges.pipe(startWith('')),
    this.languageControl.valueChanges.pipe(startWith('')),
    this.frameworkControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([templates, search, category, language, framework]) => {
      let filtered = templates;

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(template =>
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (category) {
        filtered = filtered.filter(template => template.category === category);
      }

      if (language) {
        filtered = filtered.filter(template => template.language === language);
      }

      if (framework) {
        filtered = filtered.filter(template => template.framework === framework);
      }

      return filtered.sort((a, b) => b.popularity - a.popularity);
    })
  );

  // Track by function for better performance
  trackByTemplateId = (index: number, template: CopilotTemplate): string => template.id;
  trackByTag = (index: number, tag: string): string => tag;

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates(): void {
    this.templateService.getTemplates().subscribe(templates => {
      this.templates$.next(templates);
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.languageControl.setValue('');
    this.frameworkControl.setValue('');
  }

  viewTemplate(id: string): void {
    this.router.navigate(['/templates', id]);
  }

  createTemplate(): void {
    this.router.navigate(['/templates/create']);
  }
}
