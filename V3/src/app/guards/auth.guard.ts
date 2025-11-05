import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log('AuthGuard: Checking if user is logged in...');
  const isLoggedIn = authService.isLoggedIn();
  console.log('AuthGuard: User logged in?', isLoggedIn);

  if (isLoggedIn) {
    return true;
  }

  console.log('AuthGuard: Redirecting to login...');
  router.navigate(['/login']);
  return false;
};