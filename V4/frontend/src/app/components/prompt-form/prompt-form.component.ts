import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Prompt } from '../../models/prompt.model';
import { PROMPT_CATEGORIES, PROMPT_LANGUAGES } from '../../models/prompt-metadata';
import { PromptService } from '../../services/prompt.service';
import { JsonSubmissionDialogComponent } from '../json-submission-dialog/json-submission-dialog.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-prompt-form',
    imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
],
    standalone: true,
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private promptService = inject(PromptService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  promptForm: FormGroup;
  isEditMode = false;
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  categories = PROMPT_CATEGORIES;
  languages = PROMPT_LANGUAGES;

  // Track by functions for better performance
  trackByCategory = (index: number, category: string): string => category;
  trackByLanguage = (index: number, language: string): string => language;
  trackByTag = (index: number, tag: string): string => tag;

  constructor() {
    this.promptForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      prompt: ['', Validators.required],
      category: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadPrompt(id);
    } else {
      // Add example tags for new prompts
      this.tags = ['copilot-optimized', 'checklist'];
    }
  }

  loadPrompt(id: string): void {
    this.promptService.getPrompt(id).subscribe(prompt => {
      this.promptForm.patchValue({
        title: prompt.title,
        author: prompt.author,
        description: prompt.description,
        prompt: prompt.prompt,
        category: prompt.category,
        language: prompt.language
      });
      this.tags = [...prompt.tags];
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  goBack(): void {
    this.router.navigate(['/prompts']);
  }

  onSubmit(): void {
    if (this.promptForm.valid) {
      const prompt: Prompt = {
        ...this.promptForm.value,
        tags: this.tags,
        id: this.isEditMode ? this.route.snapshot.paramMap.get('id')! : crypto.randomUUID()
      };

      if (this.isEditMode) {
        // For edit mode, use the existing service
        this.promptService.updatePrompt(prompt).subscribe({
          next: () => {
            this.snackBar.open('Prompt updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/prompts']);
          },
          error: () => {
            this.snackBar.open('Error updating prompt', 'Close', { duration: 3000 });
          }
        });
      } else {
        // For new prompts, show JSON dialog
        this.showJsonDialog(prompt);
      }
    }
  }

  showJsonDialog(prompt: Prompt): void {
    const dialogRef = this.dialog.open(JsonSubmissionDialogComponent, {
      width: '600px',
      data: { jsonData: prompt }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.proceed) {
        this.router.navigate(['/prompts']);
      }
    });
  }
}
