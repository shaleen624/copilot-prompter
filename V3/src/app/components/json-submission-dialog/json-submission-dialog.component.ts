import { Component, Inject, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Prompt } from '../../models/prompt.model';
import { CopilotTemplate } from '../../models/copilot-template.model';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-json-submission-dialog',
  templateUrl: './json-submission-dialog.component.html',
  styleUrls: ['./json-submission-dialog.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule
  ]
})
export class JsonSubmissionDialogComponent {
  jsonString: string;
  isSubmitting = false;

  private submissionService = inject(SubmissionService);
  private authService = inject(AuthService);
  
  constructor(
    public dialogRef: MatDialogRef<JsonSubmissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jsonData: Prompt | CopilotTemplate, type: 'prompt' | 'template' },
    private snackBar: MatSnackBar
  ) {
    this.jsonString = JSON.stringify(data.jsonData, null, 2);
  }

  onSubmit() {
    try {
      const parsedJson = JSON.parse(this.jsonString);
      
      if (!this.validateJson(parsedJson)) {
        this.snackBar.open('Invalid content structure', 'Close', {
          duration: 3000,
        });
        return;
      }

      this.isSubmitting = true;
      
      const submission = {
        content: parsedJson,
        type: this.data.type,
        category: parsedJson.category || 'GENERAL',
        submittedBy: this.authService.getCurrentUser().email,
      };

      this.submissionService.submitPrompt(submission).subscribe({
        next: () => {
          this.snackBar.open('Successfully submitted for approval', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error: Error) => {
          this.snackBar.open('Failed to submit: ' + error.message, 'Close', {
            duration: 5000,
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } catch (e) {
      this.snackBar.open('Invalid JSON format', 'Close', {
        duration: 3000,
      });
    }
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
  
  private validateJson(json: any): boolean {
   // if (this.data.type === 'prompt') {
      return this.validatePrompt(json);
   // } else if (this.data.type === 'template') {
    //  return this.validateTemplate(json);
    //}
    return false;
  }
  
  private validatePrompt(json: any): boolean {
    return json.title && 
           json.description && 
           json.prompt && 
           Array.isArray(json.tags) &&
           json.category &&
           json.language;
  }
  
  private validateTemplate(json: any): boolean {
    return json.name && 
           json.description && 
           json.structure && 
           typeof json.metadata === 'object';
  }
}