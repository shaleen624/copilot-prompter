import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-my-submissions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './my-submissions.component.html',
  styleUrl: './my-submissions.component.scss',
})
export class MySubmissionsComponent {
  protected submissionService = inject(SubmissionService);
  protected displayedColumns = [
    'title',
    'type',
    'status',
    'submittedDate',
    'actions',
  ];
  protected submissions = this.submissionService.mySubmissions;
}
