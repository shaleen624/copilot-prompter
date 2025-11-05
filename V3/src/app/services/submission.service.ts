import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PromptSubmission, PromptSubmissionResponse } from '../models/prompt-submission.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private _submissions = signal<PromptSubmission[]>([]);
  
  // Public signal for all submissions
  submissions = computed(() => this._submissions());
  
  // Computed signals for filtered views
  mySubmissions = computed(() => 
    this._submissions().filter(s => s.submittedBy === this.authService.getCurrentUser().email)
  );

  pendingSubmissions = computed(() => 
    this._submissions().filter(s => {
      const user = this.authService.getCurrentUser();
      if (user.role === 'ADMIN') return s.status === 'PENDING_APPROVAL';
      return s.status === 'PENDING_APPROVAL' && 
             user.assignedCategories?.includes(s.category);
    })
  );

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Initialize with mock data
    this.loadMockData();
  }

  submitPrompt(submission: Partial<PromptSubmission>): Observable<PromptSubmissionResponse> {
    const user = this.authService.getCurrentUser();
    const newSubmission: PromptSubmission = {
      ...submission as PromptSubmission,
      status: 'PENDING_APPROVAL',
      submittedBy: user.email,
      submittedDate: new Date(),
      statusHistory: [{
        status: 'PENDING_APPROVAL',
        changedBy: user.email,
        changedDate: new Date()
      }]
    };

    // Mock API call
    return of({
      success: true,
      message: 'Prompt submitted successfully',
      data: newSubmission
    }).pipe(delay(1000));
  }

  updateStatus(
    submissionId: string, 
    newStatus: 'APPROVED' | 'REJECTED' | 'NEED_AMENDMENT',
    comments?: string
  ): Observable<PromptSubmissionResponse> {
    const user = this.authService.getCurrentUser();
    const submission = this.submissions().find(s => s.id === submissionId);

    if (!submission) {
      return of({
        success: false,
        message: 'Submission not found'
      });
    }

    if (!this.authService.canApproveCategory(submission.category)) {
      return of({
        success: false,
        message: 'Unauthorized to approve this category'
      });
    }

    const updatedSubmission: PromptSubmission = {
      ...submission,
      status: newStatus,
      approverComments: comments,
      statusHistory: [
        ...submission.statusHistory,
        {
          status: newStatus,
          changedBy: user.email,
          changedDate: new Date(),
          comments
        }
      ]
    };

    // Mock API call
    return of({
      success: true,
      message: `Submission ${newStatus.toLowerCase()}`,
      data: updatedSubmission
    }).pipe(delay(1000));
  }

  getSubmissionById(id: string): Observable<PromptSubmission | undefined> {
    const submission = this.submissions().find(s => s.id === id);
    return of(submission).pipe(delay(500));
  }

  private loadMockData() {
    const mockSubmissions: PromptSubmission[] = [
      {
        id: '1',
        title: 'Angular Best Practices',
        prompt: '// 🎯 Review and suggest improvements for Angular code following best practices.\n' +
                '// Consider:\n' +
                '// - Performance optimization\n' +
                '// - Component architecture\n' +
                '// - State management\n' +
                '// - Testing approaches\n',
        description: 'A comprehensive guide for Angular development best practices and patterns',
        category: 'Frontend',
        tags: ['angular', 'typescript', 'best-practices'],
        language: 'TypeScript',
        author: 'john.doe',
        status: 'PENDING_APPROVAL',
        submittedBy: 'john.doe@example.com',
        submittedDate: new Date(),
        statusHistory: [{
          status: 'PENDING_APPROVAL',
          changedBy: 'john.doe@example.com',
          changedDate: new Date()
        }]
      },
      {
        id: '2',
        title: 'React Component Optimization',
        prompt: '// ⚡ Analyze and optimize React components for better performance.\n' +
                '// Review:\n' +
                '// - Render optimization\n' +
                '// - Hooks usage\n' +
                '// - Memoization\n' +
                '// - Code splitting\n',
        description: 'Guidelines for optimizing React components and improving application performance',
        category: 'Frontend',
        tags: ['react', 'javascript', 'performance'],
        language: 'JavaScript',
        author: 'jane.smith',
        status: 'APPROVED',
        submittedBy: 'jane.smith@example.com',
        submittedDate: new Date(Date.now() - 86400000), // 1 day ago
        statusHistory: [
          {
            status: 'PENDING_APPROVAL',
            changedBy: 'jane.smith@example.com',
            changedDate: new Date(Date.now() - 86400000)
          },
          {
            status: 'APPROVED',
            changedBy: 'admin@example.com',
            changedDate: new Date(),
            comments: 'Great guidelines, approved!'
          }
        ]
      },
      {
        id: '3',
        title: 'Spring Boot API Design',
        prompt: '// 🔧 Review Spring Boot API design and suggest improvements.\n' +
                '// Focus on:\n' +
                '// - RESTful principles\n' +
                '// - Security best practices\n' +
                '// - Error handling\n' +
                '// - Documentation\n',
        description: 'Best practices for designing Spring Boot APIs',
        category: 'Backend',
        tags: ['spring-boot', 'java', 'api-design'],
        language: 'Java',
        author: 'bob.wilson',
        status: 'NEED_AMENDMENT',
        submittedBy: 'bob.wilson@example.com',
        submittedDate: new Date(Date.now() - 172800000), // 2 days ago
        approverComments: 'Please add more details about security implementations and authentication flows',
        statusHistory: [
          {
            status: 'PENDING_APPROVAL',
            changedBy: 'bob.wilson@example.com',
            changedDate: new Date(Date.now() - 172800000)
          },
          {
            status: 'NEED_AMENDMENT',
            changedBy: 'admin@example.com',
            changedDate: new Date(Date.now() - 86400000),
            comments: 'Please add more details about security implementations and authentication flows'
          }
        ]
      }
    ];

    this._submissions.set(mockSubmissions);
  }
}