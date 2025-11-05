import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../../services/submission.service';

@Component({
  selector: 'app-submission-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    RouterModule
  ],
 templateUrl: './submission-dashboard.component.html',
 styleUrl: './submission-dashboard.component.scss'
})
export class SubmissionDashboardComponent {
  protected submissionService = inject(SubmissionService);
  protected displayedColumns = ['title', 'type', 'submittedBy', 'submittedDate', 'actions'];
}