import { Component, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { switchMap } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { PromptSubmission } from '../../models/prompt-submission.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { StatusDialogComponent } from '../shared/dialogs/status-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule
  ],
  template: `
    @if (submission(); as sub) {
      <div class="detail-container">
        <mat-card>
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>description</mat-icon>
            </div>
            <mat-card-title>{{sub.title}}</mat-card-title>
            <mat-card-subtitle>
              <div class="chip-list" role="list">
                <mat-chip [class]="getStatusClass(sub.status)">
                  {{sub.status}}
                </mat-chip>
                <mat-chip>{{sub.category}}</mat-chip>
              </div>
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="content-section">
              <h3>Description</h3>
              <p>{{sub.description}}</p>
            </div>

            <mat-divider></mat-divider>

            <div class="content-section">
              <h3>Prompt</h3>
              <pre class="prompt-content">{{sub.prompt}}</pre>
            </div>

            @if (sub.approverComments) {
              <mat-divider></mat-divider>
              <div class="content-section">
                <h3>Approver Comments</h3>
                <p class="approver-comments">{{sub.approverComments}}</p>
              </div>
            }

            <mat-divider></mat-divider>

            <div class="content-section">
              <h3>Status History</h3>
              <mat-list>
                @for (history of sub.statusHistory; track history.changedDate) {
                  <mat-list-item>
                    <mat-icon matListItemIcon>history</mat-icon>
                    <div matListItemTitle>
                      {{history.status}}
                      <span class="history-date">
                        {{history.changedDate | date:'medium'}}
                      </span>
                    </div>
                    @if (history.comments) {
                      <div matListItemLine>{{history.comments}}</div>
                    }
                  </mat-list-item>
                }
              </mat-list>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button routerLink="/dashboard">
              <mat-icon>arrow_back</mat-icon>
              Back to Dashboard
            </button>
            
            @if (canApprove() && sub.status === 'PENDING_APPROVAL') {
              <button mat-raised-button color="primary" (click)="onApprove(sub)">
                <mat-icon>check_circle</mat-icon>
                Approve
              </button>
              <button mat-raised-button color="accent" (click)="onRequestChanges(sub)">
                <mat-icon>feedback</mat-icon>
                Request Changes
              </button>
              <button mat-raised-button color="warn" (click)="onReject(sub)">
                <mat-icon>cancel</mat-icon>
                Reject
              </button>
            }
          </mat-card-actions>
        </mat-card>
      </div>
    } @else {
      <mat-card>
        <mat-card-content>
          <p>Loading submission details...</p>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .content-section {
      margin: 20px 0;

      h3 {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .prompt-content {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }

    .approver-comments {
      padding: 16px;
      background: #fff3e0;
      border-radius: 4px;
      border-left: 4px solid #ff9800;
    }

    .history-date {
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.85em;
      margin-left: 8px;
    }

    // Status chip styles from the table component
    .status-chip {
      &.pending {
        background-color: #fff3e0;
        color: #e65100;
      }
      &.approved {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      &.rejected {
        background-color: #ffebee;
        color: #c62828;
      }
      &.amendment {
        background-color: #e3f2fd;
        color: #1565c0;
      }
    }

    mat-card-actions {
      padding: 16px;
      gap: 8px;
    }
  `]
})
export class SubmissionDetailComponent {
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  protected submissionService = inject(SubmissionService);
  protected authService = inject(AuthService);

  protected submission = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => this.submissionService.getSubmissionById(params.get('id') || ''))
    )
  );

  protected canApprove = computed(() => {
    const sub = this.submission();
    if (!sub) return false;
    return this.authService.canApproveCategory(sub.category);
  });

  private clipboard = inject(Clipboard);
  private location = inject(Location);

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'NEED_AMENDMENT':
        return 'warning';
      default:
        return 'info';
    }
  }

  protected isAdmin(): boolean {
    return this.authService.getCurrentUser().role === 'ADMIN';
  }

  protected goBack(): void {
    this.location.back();
  }

  protected copyPrompt(text: string): void {
    this.clipboard.copy(text);
    this.snackBar.open('Prompt copied to clipboard', 'Dismiss', {
      duration: 2000,
      horizontalPosition: 'end'
    });
  }

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