import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PromptSubmission } from '../../../models/prompt-submission.model';

export interface StatusDialogData {
  submission: PromptSubmission;
  action: 'approve' | 'reject' | 'request-changes';
}

@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>
      @switch (data.action) {
        @case ('approve') {
          Approve Submission
        }
        @case ('reject') {
          Reject Submission
        }
        @case ('request-changes') {
          Request Changes
        }
      }
    </h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <p>{{getActionMessage()}}</p>
        
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Comments</mat-label>
          <textarea 
            matInput 
            formControlName="comments" 
            [placeholder]="getPlaceholder()"
            [required]="data.action !== 'approve'"
            rows="4">
          </textarea>
          @if (form.get('comments')?.hasError('required') && form.get('comments')?.touched) {
            <mat-error>Comments are required</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-raised-button 
          [color]="getActionColor()" 
          type="submit"
          [disabled]="!form.valid">
          {{getActionButton()}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      min-width: 400px;
    }

    p {
      margin-bottom: 16px;
    }
  `]
})
export class StatusDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData
  ) {
    this.form = this.fb.group({
      comments: ['', data.action !== 'approve' ? Validators.required : []]
    });
  }

  getActionMessage(): string {
    const title = this.data.submission.title;
    switch (this.data.action) {
      case 'approve':
        return `Are you sure you want to approve "${title}"?`;
      case 'reject':
        return `Please provide a reason for rejecting "${title}".`;
      case 'request-changes':
        return `Please specify the changes needed for "${title}".`;
      default:
        return '';
    }
  }

  getPlaceholder(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Optional comments';
      case 'reject':
        return 'Reason for rejection (required)';
      case 'request-changes':
        return 'Describe the changes needed (required)';
      default:
        return '';
    }
  }

  getActionColor(): string {
    switch (this.data.action) {
      case 'approve':
        return 'primary';
      case 'reject':
        return 'warn';
      case 'request-changes':
        return 'accent';
      default:
        return '';
    }
  }

  getActionButton(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Approve';
      case 'reject':
        return 'Reject';
      case 'request-changes':
        return 'Request Changes';
      default:
        return '';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({
        action: this.data.action,
        comments: this.form.value.comments
      });
    }
  }
}