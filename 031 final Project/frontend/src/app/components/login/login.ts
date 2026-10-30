
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

 login(): void {
  this.error = '';

  if (!this.username.trim() || !this.password) {
    this.error = 'Enter your username and password.';
    return;
  }

  this.loading = true;

  this.auth.signin({
    username: this.username.trim(),
    password: this.password
  }).subscribe({
    next: (response) => {
      if (response.login === 'done' && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.userRole ?? '');

        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Sign-in failed.';
        this.loading = false;
      }
    },
    error: (err) => {
      console.error('Sign-in error:', err);

      if (err.status === 401) {
        this.error = 'Invalid username or password.';
      } else {
        this.error = 'Unable to connect to the server.';
      }

      this.loading = false;
    }
  });
}
}
