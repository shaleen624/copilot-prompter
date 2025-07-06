
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs';
import { Prompt } from '../../models/prompt.model';
import { PromptService } from '../../services/prompt.service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt$!: Observable<Prompt | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService,
    private location: Location,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.prompt$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.promptService.getPrompt(id);
        }
        return of(undefined);
      })
    );
  }

  copyPrompt(promptText: string): void {
    navigator.clipboard.writeText(promptText).then(() => {
      this.snackBar.open('Prompt copied to clipboard!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      this.snackBar.open('Failed to copy prompt.', 'Close', { duration: 3000 });
    });
  }
  
  editPrompt(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  goBack(): void {
    this.location.back();
  }
}