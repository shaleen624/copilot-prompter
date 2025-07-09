
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs';
import { Prompt } from '../../models/prompt.model';
import { PromptService } from '../../services/prompt.service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-prompt-detail',
    imports: [
        CommonModule, RouterModule, FormsModule, MatCardModule, MatChipsModule,
        MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule,
        MatInputModule, MatFormFieldModule
    ],
    templateUrl: './prompt-detail.component.html',
    styleUrls: ['./prompt-detail.component.css'],
    standalone: true
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | undefined;
  editedPrompt: string = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isUpdating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService,
    private location: Location,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getPrompt();
  }

  getPrompt(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promptService.getPrompt(id).subscribe({
        next: (prompt) => {
          this.prompt = prompt;
          this.editedPrompt = prompt ? prompt.prompt : '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching prompt:', error);
          this.isLoading = false;
          this.snackBar.open('Error loading prompt', 'Close', { duration: 3000 });
        }
      });
    }
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Exit edit mode without saving changes
      this.editedPrompt = this.prompt?.prompt || '';
      this.isEditMode = false;
    } else {
      // Enter edit mode
      this.isEditMode = true;
    }
  }

  applyInlineChanges(): void {
    if (!this.prompt) return;

    // Just update the display without saving to backend
    this.prompt = { ...this.prompt, prompt: this.editedPrompt };
    this.isEditMode = false;
    this.snackBar.open('Prompt updated for copying', 'Close', { duration: 2000 });
  }

  saveChanges(): void {
    if (!this.prompt) return;

    this.isUpdating = true;
    const updatedPrompt = { ...this.prompt, prompt: this.editedPrompt };
    
    this.promptService.updatePrompt(updatedPrompt).subscribe({
      next: (savedPrompt) => {
        this.prompt = savedPrompt;
        this.editedPrompt = savedPrompt.prompt;
        this.isEditMode = false;
        this.isUpdating = false;
        this.snackBar.open('Prompt updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating prompt:', error);
        this.isUpdating = false;
        this.snackBar.open('Error updating prompt', 'Close', { duration: 3000 });
      }
    });
  }

  copyToClipboard(): void {
    const textToCopy = this.isEditMode ? this.editedPrompt : this.prompt?.prompt;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.snackBar.open('Prompt copied to clipboard!', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }).catch(err => {
        console.error('Failed to copy text:', err);
        this.snackBar.open('Failed to copy prompt', 'Close', { duration: 2000 });
      });
    }
  }

  editPrompt(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  goBack(): void {
    this.location.back();
  }
}