import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CopilotTemplate } from '../../models/copilot-template.model';
import { CopilotTemplateService } from '../../services/copilot-template.service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

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
    DatePipe
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
  private location = inject(Location);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  template: CopilotTemplate | undefined;
  isLoading: boolean = false;

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
      // This would typically integrate with GitHub API
      // For now, just copy to clipboard and show instructions
      navigator.clipboard.writeText(this.template.content).then(() => {
        this.snackBar.open('Template copied! Create .github/copilot-instructions.md in your repo', 'Close', { duration: 5000 });
      });
    }
  }

  editTemplate(): void {
    if (this.template) {
      this.router.navigate(['/templates/edit', this.template.id]);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
