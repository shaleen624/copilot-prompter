import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, MatIconModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  // Animation frames for the glitch effect
  protected glitchTexts = [
    '404',
    '4○4',
    '4⦿4',
    '4⊗4',
    '4⊕4'
  ];
  
  protected currentGlitchIndex = 0;

  ngOnInit() {
    // Start the glitch animation
    setInterval(() => {
      this.currentGlitchIndex = (this.currentGlitchIndex + 1) % this.glitchTexts.length;
    }, 200);
  }

  goBack(): void {
    window.history.back();
  }
}