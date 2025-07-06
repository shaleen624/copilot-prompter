import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Prompt } from '../../models/prompt.model';
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

@Component({
    selector: 'app-prompt-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.css']
})
export class PromptFormComponent implements OnInit {
  promptForm: FormGroup;
  isEditMode = false;
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  categories = ['Testing', 'Backend', 'Frontend', 'DevOps', 'Database', 'Security'];
  languages = ['JavaScript', 'Python', 'TypeScript', 'Java'];

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.promptForm = this.fb.group({
      title: ['', Validators.required],
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
    }
  }

  loadPrompt(id: string): void {
    this.promptService.getPrompt(id).subscribe(prompt => {
      this.promptForm.patchValue({
        title: prompt.title,
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
        id: this.isEditMode ? this.route.snapshot.paramMap.get('id')! : crypto.randomUUID(),
        author: 'user123' // In a real app, this would come from auth service
      };

      const operation = this.isEditMode ?
        this.promptService.updatePrompt(prompt) :
        this.promptService.addPrompt(prompt);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Prompt ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/prompts']);
        },
        error: () => {
          this.snackBar.open(
            'Error saving prompt',
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
