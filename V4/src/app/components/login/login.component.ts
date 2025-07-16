import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // If user is already logged in, redirect to main page
    if (this.adminService.checkLoggedIn()) {
      this.router.navigate(['/prompts']);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { username, password } = this.loginForm.value;
      
      // Simulate API call delay
      setTimeout(() => {
        const loginSuccess = this.adminService.login(username, password);
        
        if (loginSuccess) {
          this.router.navigate(['/prompts']);
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
        
        this.isLoading = false;
      }, 1000);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
