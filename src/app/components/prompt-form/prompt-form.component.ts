import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Prompt } from '../../models/prompt.model';
import { PROMPT_CATEGORIES, PROMPT_LANGUAGES } from '../../models/prompt-metadata';
import { PromptService } from '../../services/prompt.service';

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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

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
      data: { prompt }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/prompts']);
      }
    });
  }
}

// JSON Submission Dialog Component
@Component({
  selector: 'app-json-submission-dialog',
  template: `
    <h2 mat-dialog-title>📤 Submit Your Prompt</h2>
    <mat-dialog-content>
      <p class="submission-message">
        <strong>Thank you for contributing to our Copilot Prompter community!</strong>
      </p>
      <p class="submission-instructions">
        Since we don't have a database yet, please copy the JSON below and submit it to our 
        <a href="https://sharepoint.company.com/prompts" target="_blank" class="sharepoint-link">
          SharePoint submission portal
        </a>
        . Our team will review your prompt for usability and quality before adding it to the collection.
      </p>
      
      <mat-form-field class="json-field" appearance="outline">
        <mat-label>Prompt JSON</mat-label>
        <textarea 
          matInput 
          readonly 
          rows="12" 
          class="json-textarea"
          [value]="jsonString">
        </textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="copyJson()">
        <mat-icon>content_copy</mat-icon>
        Copy JSON
      </button>
      <button mat-flat-button color="accent" (click)="onSubmit()">
        <mat-icon>open_in_new</mat-icon>
        Go to SharePoint
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .submission-message {
      margin-bottom: 16px;
      color: #2e7d32;
      font-size: 16px;
    }
    .submission-instructions {
      margin-bottom: 20px;
      line-height: 1.6;
      color: #424242;
    }
    .sharepoint-link {
      color: #1976d2;
      text-decoration: none;
    }
    .sharepoint-link:hover {
      text-decoration: underline;
    }
    .json-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .json-textarea {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      background-color: #f8f9fa;
    }
    mat-dialog-content {
      max-height: 500px;
      overflow-y: auto;
    }
  `],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
]
})
export class JsonSubmissionDialogComponent {
  jsonString: string;

  constructor(
    public dialogRef: MatDialogRef<JsonSubmissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prompt: Prompt },
    private snackBar: MatSnackBar
  ) {
    this.jsonString = JSON.stringify(data.prompt, null, 2);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  copyJson(): void {
    navigator.clipboard.writeText(this.jsonString).then(() => {
      this.snackBar.open('JSON copied to clipboard!', 'Close', { duration: 2000 });
    }).catch(() => {
      this.snackBar.open('Failed to copy JSON', 'Close', { duration: 2000 });
    });
  }

  onSubmit(): void {
    // Open SharePoint link
    window.open('https://sharepoint.company.com/prompts', '_blank');
    this.dialogRef.close(true);
  }
}
