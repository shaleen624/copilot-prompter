export type UserRole = 'ADMIN' | 'CATEGORY_APPROVER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedCategories?: string[];
}

export interface StatusHistory {
  status: SubmissionStatus;
  changedBy: string;
  changedDate: Date;
  comments?: string;
}

export type SubmissionStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'NEED_AMENDMENT';