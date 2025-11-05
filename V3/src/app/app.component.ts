import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PerformanceService } from './services/performance.service';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private performanceService = inject(PerformanceService);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  
  title = 'Copilot Prompter';
  currentRoute = signal('');

  get isAdmin() {
    return this.adminService.isAdmin;
  }

  get isLoggedIn() {
    return this.adminService.isLoggedIn;
  }

  get enableLogin() {
    return this.adminService.enableLogin;
  }

  ngOnInit(): void {
    // Log performance metrics after app initialization
    console.log('AppComponent initialized');
    setTimeout(() => {
      this.performanceService.logPerformanceMetrics();
    }, 2000);

    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation event:', event);
      this.currentRoute.set(event.url);
      console.log('Current route set to:', this.currentRoute());
    });

    // Set initial route
    this.currentRoute.set(this.router.url);
  }

  toggleAdminMode(): void {
    this.adminService.toggleAdminMode();
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/']);
  }

  isPromptsActive(): boolean {
    const route = this.currentRoute();
    return route.includes('/prompts') || route === '/create' || route === '/' || route === '';
  }

  isTemplatesActive(): boolean {
    return this.currentRoute().includes('/templates');
  }

  isLandingOrLogin(): boolean {
    const route = this.currentRoute();
    // Only return true for exact '/' or '/login' paths
    return route === '/' || route === '/login' || route === '';
  }

  navigateTo(route: string): void {
    if (route === '/my-submissions' && !this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (route === '/admin/submissions' && !this.isAdmin()) {
      this.snackBar.open('Unauthorized access', 'Close', { duration: 3000 });
      return;
    }
    this.router.navigate([route]);
  }
}
