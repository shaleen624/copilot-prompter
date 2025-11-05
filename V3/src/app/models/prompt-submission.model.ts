import { Prompt } from './prompt.model';
import { StatusHistory, SubmissionStatus } from './user.model';

export interface PromptSubmission extends Prompt {
  status: SubmissionStatus;
  submittedBy: string;
  submittedDate: Date;
  assignedTo?: string;
  approverComments?: string;
  statusHistory: StatusHistory[];
  category: string;
}

export interface PromptSubmissionResponse {
  success: boolean;
  message: string;
  data?: PromptSubmission;
}