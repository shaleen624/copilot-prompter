import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CopilotTemplate } from '../../models/copilot-template.model';
import { CopilotTemplateService } from '../../services/copilot-template.service';
import { GitHubIntegrationService } from '../../services/github-integration.service';
import { AdminService } from '../../services/admin.service';
import { MarkdownComponent } from 'ngx-markdown';
import { CodeEditorComponent } from '../code-editor';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-template-detail',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    DatePipe,
    MarkdownComponent,
    CodeEditorComponent
  ],
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private templateService = inject(CopilotTemplateService);
  private githubService = inject(GitHubIntegrationService);
  private location = inject(Location);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private adminService = inject(AdminService);

  template: CopilotTemplate | undefined;
  isLoading: boolean = false;
  isEditMode = signal(false);
  editableContent = signal('');
  selectedTabIndex = signal(0);

  get isAdmin() {
    return this.adminService.isAdmin;
  }

  // Track by function for better performance
  trackByTag = (index: number, tag: string): string => tag;

  ngOnInit(): void {
    this.getTemplate();
  }

  getTemplate(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.cdr.markForCheck();
      
      this.templateService.getTemplate(id)
        .subscribe({
          next: (template) => {
            this.template = template;
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error fetching template:', error);
            this.isLoading = false;
            this.cdr.markForCheck();
            this.snackBar.open('Error loading template', 'Close', { duration: 3000 });
          }
        });
    }
  }

  copyToClipboard(): void {
    if (this.template) {
      navigator.clipboard.writeText(this.template.content).then(() => {
        this.snackBar.open('Template copied to clipboard!', 'Close', { duration: 2000 });
      }).catch(() => {
        this.snackBar.open('Failed to copy template', 'Close', { duration: 2000 });
      });
    }
  }

  downloadAsMarkdown(): void {
    if (this.template) {
      const blob = new Blob([this.template.content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.template.name.replace(/\s+/g, '-').toLowerCase()}-copilot-instructions.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('Template downloaded!', 'Close', { duration: 2000 });
    }
  }

  createGitHubFile(): void {
    if (this.template) {
      if (this.githubService.isAuthenticated()) {
        // Navigate to GitHub integration with this template pre-selected
        this.router.navigate(['/github-integration'], { 
          state: { selectedTemplate: this.template }
        });
      } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(this.template.content).then(() => {
          const snackBarRef = this.snackBar.open(
            'Template copied! Create .github/copilot-instructions.md in your repo or connect via GitHub Integration', 
            'GitHub Integration', 
            { duration: 8000 }
          );
          
          snackBarRef.onAction().subscribe(() => {
            this.router.navigate(['/github-integration']);
          });
        });
      }
    }
  }

  editTemplate(): void {
    if (this.template) {
      this.router.navigate(['/templates/edit', this.template.id]);
    }
  }

  startInlineEdit(): void {
    if (this.template) {
      this.editableContent.set(this.template.content);
      this.isEditMode.set(true);
      
      // If we're on the preview tab, switch to raw markdown tab
      if (this.selectedTabIndex() === 0) {
        this.selectedTabIndex.set(1);
        
        // Use shorter timeout to ensure tab switch completes
        setTimeout(() => {
          this.cdr.markForCheck();
          // Trigger gentle autosize recalculation after tab switch
          this.triggerTextareaResize();
        }, 50);
      } else {
        this.cdr.markForCheck();
        // Trigger gentle autosize recalculation
        setTimeout(() => this.triggerTextareaResize(), 20);
      }
    }
  }

  cancelInlineEdit(): void {
    this.isEditMode.set(false);
    this.editableContent.set('');
    this.cdr.markForCheck();
  }

  saveInlineEdit(): void {
    if (this.template && this.editableContent()) {
      this.template.content = this.editableContent();
      this.isEditMode.set(false);
      this.snackBar.open('Content updated (local changes only)', 'Close', { duration: 3000 });
      this.cdr.markForCheck();
    }
  }

  onContentChange(newContent: string): void {
    this.editableContent.set(newContent);
  }

  onTabChange(index: number): void {
    this.selectedTabIndex.set(index);
    
    // If switching to the raw markdown tab and we're in edit mode, 
    // ensure textarea gets proper sizing
    if (index === 1 && this.isEditMode()) {
      setTimeout(() => {
        this.triggerTextareaResize();
      }, 50);
    }
  }

  private triggerTextareaResize(): void {
    // Find textarea elements and gently trigger resize
    const textareas = document.querySelectorAll('textarea[cdkTextareaAutosize]');
    textareas.forEach(textarea => {
      // Just dispatch an input event to trigger autosize recalculation
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
