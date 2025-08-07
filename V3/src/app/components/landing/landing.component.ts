import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToPrompts(): void {
    this.router.navigate(['/prompts']);
  }

  navigateToTemplates(): void {
    this.router.navigate(['/templates']);
  }

  navigateToSourceControl(): void {
    this.router.navigate(['/source-control']);
  }
}
