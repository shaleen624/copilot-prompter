import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Prompt } from '../../models/prompt.model';
import { PROMPT_CATEGORIES, PROMPT_LANGUAGES } from '../../models/prompt-metadata';
import { PromptService } from '../../services/prompt.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-prompt-list',
    imports: [
        CommonModule, RouterModule, ReactiveFormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
        MatChipsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
    ],
    templateUrl: './prompt-list.component.html',
    styleUrls: ['./prompt-list.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptListComponent implements OnInit {
  private router = inject(Router);
  private promptService = inject(PromptService);
  
  prompts$ = new BehaviorSubject<Prompt[]>([]);
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  languageControl = new FormControl('');

  categories: string[] = PROMPT_CATEGORIES;
  languages: string[] = PROMPT_LANGUAGES;

  filteredPrompts$: Observable<Prompt[]> = combineLatest([
    this.prompts$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.categoryControl.valueChanges.pipe(startWith('')),
    this.languageControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([prompts, search, category, language]) => {
      let filtered = prompts;

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(prompt =>
          prompt.title.toLowerCase().includes(searchLower) ||
          prompt.description.toLowerCase().includes(searchLower) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (category) {
        filtered = filtered.filter(prompt => prompt.category === category);
      }

      if (language) {
        filtered = filtered.filter(prompt => prompt.language === language);
      }

      return filtered;
    })
  );

  // Track by function for better performance
  trackByPromptId = (index: number, prompt: Prompt): string => prompt.id;
  trackByTag = (index: number, tag: string): string => tag;

  ngOnInit(): void {
    this.getPrompts();
  }

  getPrompts(): void {
    this.promptService.getPrompts().subscribe(prompts => {
      this.prompts$.next(prompts);
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.languageControl.setValue('');
  }
}