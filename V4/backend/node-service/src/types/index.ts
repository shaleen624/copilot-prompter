export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface Prompt {
  id: number;
  title: string;
  prompt: string;
  description?: string;
  tags: string[];
  category: string;
  language: string;
  author: string;
  active: boolean;
  viewCount: number;
  copyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CopilotTemplate {
  id: number;
  name: string;
  category: string;
  language: string;
  framework?: string;
  description?: string;
  content: string;
  tags: string[];
  author: string;
  active: boolean;
  popularity: number;
  viewCount: number;
  downloadCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchParams {
  query?: string;
  category?: string;
  language?: string;
  tags?: string[];
  author?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgresql';
  path?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  logging?: boolean;
}
