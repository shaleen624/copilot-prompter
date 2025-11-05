import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser = signal<User>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'USER' as UserRole,
    assignedCategories: []
  });

  constructor(private snackBar: MatSnackBar) {}

  getCurrentUser(): User {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return true; // TODO: Implement actual login check
  }

  isAdmin(): boolean {
    return this.currentUser().role === 'ADMIN';
  }

  isCategoryApprover(): boolean {
    return this.currentUser().role === 'CATEGORY_APPROVER';
  }

  canApproveCategory(category: string): boolean {
    const user = this.currentUser();
    return user.role === 'ADMIN' ||
           (user.role === 'CATEGORY_APPROVER' &&
            (user.assignedCategories?.includes(category) ?? false));
  }

  // Mock login - in real app, this would validate with backend
  login(): Observable<User> {
    return of(this.currentUser()).pipe(delay(1000));
  }

  // Mock method to change user role for testing
  setUserRole(role: UserRole, categories?: string[]) {
    this.currentUser.update(user => ({
      ...user,
      role,
      assignedCategories: categories || []
    }));
  }
}