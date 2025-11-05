import { Component, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { PromptSubmission } from '../../models/prompt-submission.model';

@Component({
  selector: 'app-submission-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="table-container">
      <div class="table-header">
        <mat-form-field appearance="outline">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterControl" placeholder="Search submissions...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [formControl]="categoryFilter">
            <mat-option value="">All Categories</mat-option>
            @for (category of categories(); track category) {
              <mat-option [value]="category">{{category}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [formControl]="statusFilter">
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="PENDING_APPROVAL">Pending Approval</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
            <mat-option value="NEED_AMENDMENT">Need Amendment</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (isLoading()) {
        <div class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (error()) {
        <div class="error-message">
          <mat-icon color="warn">error</mat-icon>
          <span>{{error()}}</span>
          <button mat-button color="primary" (click)="retry.emit()">Retry</button>
        </div>
      }

      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="sortData($event)">
        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Title </th>
          <td mat-cell *matCellDef="let submission">
            <a [routerLink]="['/submissions', submission.id]">
              {{submission.title}}
            </a>
          </td>
        </ng-container>

        <!-- Category Column -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Category </th>
          <td mat-cell *matCellDef="let submission"> {{submission.category}} </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let submission">
            <mat-chip [class]="getStatusClass(submission.status)">
              {{submission.status}}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Submitted Date Column -->
        <ng-container matColumnDef="submittedDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Submitted </th>
          <td mat-cell *matCellDef="let submission">
            {{submission.submittedDate | date:'short'}}
          </td>
        </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let submission">
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onView(submission)">
              <mat-icon>visibility</mat-icon>
              <span>View</span>
            </button>
            @if (submission.status === 'NEED_AMENDMENT') {
              <button mat-menu-item (click)="onEdit(submission)">
                <mat-icon>edit</mat-icon>
                <span>Edit</span>
              </button>
            }
            @if (canApprove) {
              <button mat-menu-item (click)="onApprove(submission)">
                <mat-icon>check_circle</mat-icon>
                <span>Approve</span>
              </button>
              <button mat-menu-item (click)="onReject(submission)">
                <mat-icon>cancel</mat-icon>
                <span>Reject</span>
              </button>
              <button mat-menu-item (click)="onRequestChanges(submission)">
                <mat-icon>feedback</mat-icon>
                <span>Request Changes</span>
              </button>
            }
          </mat-menu>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator 
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page of submissions">
    </mat-paginator>
  `,
  styles: [`
    .table-container {
      position: relative;
      min-height: 200px;
    }

    .table-header {
      display: flex;
      gap: 16px;
      padding: 16px;
      flex-wrap: wrap;

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-message {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #c62828;

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
      }
    }

    .mat-mdc-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

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

    // Fix table header alignment
    .mat-sort-header-container {
      justify-content: flex-start !important;
    }

    .mat-column-actions {
      width: 60px;
      text-align: center;
    }

    a {
      color: inherit;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class SubmissionTableComponent implements OnInit {
  @Input() submissions: PromptSubmission[] = [];
  @Input() canApprove = false;
  @Input() displayedColumns: string[] = ['title', 'category', 'status', 'submittedDate', 'actions'];

  @Output() view = new EventEmitter<PromptSubmission>();
  @Output() edit = new EventEmitter<PromptSubmission>();
  @Output() approve = new EventEmitter<PromptSubmission>();
  @Output() reject = new EventEmitter<PromptSubmission>();
  @Output() requestChanges = new EventEmitter<PromptSubmission>();
  @Output() retry = new EventEmitter<void>();

  @ViewChild(MatTable) table!: MatTable<PromptSubmission>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected dataSource!: MatTableDataSource<PromptSubmission>;
  protected filterControl = new FormControl('');
  protected categoryFilter = new FormControl('');
  protected statusFilter = new FormControl('');
  protected categories = signal<string[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit() {
    // Initialize the table data source
    this.dataSource = new MatTableDataSource(this.submissions);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Extract unique categories
    this.updateCategories();

    // Set up filtering
    this.setupFilters();
  }

  private updateCategories() {
    const uniqueCategories = [...new Set(this.submissions.map(s => s.category))];
    this.categories.set(uniqueCategories);
  }

  private setupFilters() {
    // Combined filter function
    this.dataSource.filterPredicate = (data: PromptSubmission, filter: string) => {
      const searchFilter = filter.toLowerCase();
      const categoryValue = this.categoryFilter.value;
      const statusValue = this.statusFilter.value;

      const matchesSearch = !searchFilter ||
        data.title.toLowerCase().includes(searchFilter) ||
        data.description.toLowerCase().includes(searchFilter);
      
      const matchesCategory = !categoryValue || data.category === categoryValue;
      const matchesStatus = !statusValue || data.status === statusValue;

      return matchesSearch && matchesCategory && matchesStatus;
    };

    // Subscribe to filter changes
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.dataSource.filter = value?.toLowerCase() || '';
    });

    this.categoryFilter.valueChanges.subscribe(() => {
      this.dataSource.filter = this.filterControl.value?.toLowerCase() || '';
    });

    this.statusFilter.valueChanges.subscribe(() => {
      this.dataSource.filter = this.filterControl.value?.toLowerCase() || '';
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING_APPROVAL': 'pending',
      'APPROVED': 'approved',
      'REJECTED': 'rejected',
      'NEED_AMENDMENT': 'amendment'
    };
    return `status-chip ${statusMap[status] || ''}`;
  }

  sortData(sort: Sort) {
    this.dataSource.sort = this.sort;
  }

  onView(submission: PromptSubmission) {
    this.view.emit(submission);
  }

  onEdit(submission: PromptSubmission) {
    this.edit.emit(submission);
  }

  onApprove(submission: PromptSubmission) {
    this.approve.emit(submission);
  }

  onReject(submission: PromptSubmission) {
    this.reject.emit(submission);
  }

  onRequestChanges(submission: PromptSubmission) {
    this.requestChanges.emit(submission);
  }
}