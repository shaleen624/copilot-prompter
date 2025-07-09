import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-json-submission-dialog',
  templateUrl: './json-submission-dialog.component.html',
  styleUrls: ['./json-submission-dialog.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
