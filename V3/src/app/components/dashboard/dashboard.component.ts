import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { SubmissionTableComponent } from '../shared/submission-table.component';
import { StatusDialogComponent } from '../shared/dialogs/status-dialog.component';
import { PromptSubmission } from '../../models/prompt-submission.model';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatTabsModule,
    SubmissionTableComponent
  ],
  template: `
    <div class="dashboard-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome, {{authService.getCurrentUser().name}}</mat-card-title>
          <mat-card-subtitle>
            @if (authService.isAdmin()) {
              Administrator Dashboard
            } @else if (authService.isCategoryApprover()) {
              Category Approver Dashboard
            } @else {
              User Dashboard
            }
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            @if (authService.isAdmin() || authService.isCategoryApprover()) {
              <mat-tab label="Pending Approvals">
                <app-submission-table 
                  [submissions]="submissionService.pendingSubmissions()"
                  [canApprove]="true"
                  (approve)="onApprove($event)"
                  (reject)="onReject($event)"
                  (requestChanges)="onRequestChanges($event)">
                </app-submission-table>
              </mat-tab>
            }

            <mat-tab label="My Submissions">
              <app-submission-table 
                [submissions]="submissionService.mySubmissions()"
                [canApprove]="false">
              </app-submission-table>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      
      mat-card {
        margin-bottom: 20px;
      }

      mat-tab-group {
        margin-top: 20px;
      }
    }
  `]
})
export class DashboardComponent {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  constructor(
    protected authService: AuthService,
    protected submissionService: SubmissionService
  ) {}

  onApprove(submission: PromptSubmission) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: { submission, action: 'approve' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submissionService.updateStatus(submission.id, 'APPROVED', result.comments)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.snackBar.open('Submission approved successfully', 'Close', {
                  duration: 3000
                });
              }
            }
          });
      }
    });
  }

  onReject(submission: PromptSubmission) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: { submission, action: 'reject' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submissionService.updateStatus(submission.id, 'REJECTED', result.comments)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.snackBar.open('Submission rejected', 'Close', {
                  duration: 3000
                });
              }
            }
          });
      }
    });
  }

  onRequestChanges(submission: PromptSubmission) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: { submission, action: 'request-changes' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submissionService.updateStatus(submission.id, 'NEED_AMENDMENT', result.comments)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.snackBar.open('Changes requested from submitter', 'Close', {
                  duration: 3000
                });
              }
            }
          });
      }
    });
  }
}