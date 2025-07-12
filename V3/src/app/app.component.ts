import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerformanceService } from './services/performance.service';
import { AdminService } from './services/admin.service';
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
    MatSlideToggleModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private performanceService = inject(PerformanceService);
  private router = inject(Router);
  private adminService = inject(AdminService);
  
  title = 'Copilot Prompter';
  currentRoute = signal('');

  get isAdmin() {
    return this.adminService.isAdmin;
  }

  ngOnInit(): void {
    // Log performance metrics after app initialization
    setTimeout(() => {
      this.performanceService.logPerformanceMetrics();
    }, 2000);

    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.url);
    });

    // Set initial route
    this.currentRoute.set(this.router.url);
  }

  toggleAdminMode(): void {
    this.adminService.toggleAdminMode();
  }

  isPromptsActive(): boolean {
    return this.currentRoute().includes('/prompts') || this.currentRoute() === '/create';
  }

  isTemplatesActive(): boolean {
    return this.currentRoute().includes('/templates');
  }
}
