import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs';
import { Prompt } from '../../models/prompt.model';
import { PromptService } from '../../services/prompt.service';
import { AdminService } from '../../services/admin.service';
import { CodeEditorComponent } from '../code-editor';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
    selector: 'app-prompt-detail',
    imports: [
    RouterModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    TextFieldModule,
    CodeEditorComponent
],
    templateUrl: './prompt-detail.component.html',
    styleUrls: ['./prompt-detail.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private promptService = inject(PromptService);
  private location = inject(Location);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private adminService = inject(AdminService);

  prompt: Prompt | undefined;
  editedPrompt: string = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isUpdating: boolean = false;

  // Track by function for better performance
  trackByTag = (index: number, tag: string): string => tag;

  get isAdmin() {
    return this.adminService.isAdmin;
  }

  ngOnInit(): void {
    this.getPrompt();
  }

  getPrompt(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.cdr.markForCheck(); // Trigger change detection for loading state
      
      this.promptService.getPrompt(id)
        .subscribe({
          next: (prompt) => {
            this.prompt = prompt;
            this.editedPrompt = prompt.prompt;
            this.isLoading = false;
            this.cdr.markForCheck(); // Trigger change detection for loaded state
          },
          error: (error) => {
            console.error('Error fetching prompt:', error);
            this.isLoading = false;
            this.cdr.markForCheck(); // Trigger change detection for error state
            this.snackBar.open('Error loading prompt', 'Close', { duration: 3000 });
          }
        });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.prompt) {
      this.editedPrompt = this.prompt.prompt;
    }
    this.cdr.markForCheck();
  }

  applyInlineChanges(): void {
    if (!this.prompt) return;

    // Just update the display without saving to backend
    this.prompt = { ...this.prompt, prompt: this.editedPrompt };
    this.isEditMode = false;
    this.cdr.markForCheck();
    this.snackBar.open('Prompt updated for copying', 'Close', { duration: 2000 });
  }

  saveChanges(): void {
    if (!this.prompt) return;

    this.isUpdating = true;
    this.cdr.markForCheck();
    
    const updatedPrompt = { ...this.prompt, prompt: this.editedPrompt };
    
    this.promptService.updatePrompt(updatedPrompt).subscribe({
      next: (savedPrompt) => {
        this.prompt = savedPrompt;
        this.editedPrompt = savedPrompt.prompt;
        this.isEditMode = false;
        this.isUpdating = false;
        this.cdr.markForCheck();
        this.snackBar.open('Prompt updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating prompt:', error);
        this.isUpdating = false;
        this.cdr.markForCheck();
        this.snackBar.open('Error updating prompt', 'Close', { duration: 3000 });
      }
    });
  }

  copyToClipboard(): void {
    if (this.prompt) {
      navigator.clipboard.writeText(this.prompt.prompt).then(() => {
        this.snackBar.open('Copied to clipboard!', 'Close', { duration: 2000 });
      });
    }
  }

  onContentChange(newContent: string): void {
    this.editedPrompt = newContent;
  }

  downloadAsText(): void {
    if (this.prompt) {
      const blob = new Blob([this.prompt.prompt], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.prompt.title.replace(/\s+/g, '-').toLowerCase()}-prompt.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('Prompt downloaded!', 'Close', { duration: 2000 });
    }
  }

  editPrompt(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  goBack(): void {
    this.location.back();
  }
}
