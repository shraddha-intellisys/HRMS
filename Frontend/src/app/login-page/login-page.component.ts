import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LoginPageComponent {
  @ViewChild('loginForm') loginForm!: NgForm; 
  isAdminLogin: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  toggleLoginType(isAdmin: boolean) {
    this.isAdminLogin = isAdmin;
    if (this.loginForm) {
      this.loginForm.resetForm();
    }
  }

  async login(loginForm: NgForm) {
    if (!loginForm.valid) {
      alert('❌ Please enter valid credentials.');
      return;
    }
  
    const { username, password } = loginForm.value;
    const endpoint = this.isAdminLogin ? 'admin-login' : 'login';
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || '❌ Login failed');
      }
  
      if (!data.employeeId && !this.isAdminLogin) {
        throw new Error('❌ Employee verification failed. No employeeId returned.');
      }
  
      // Store user data in localStorage
      localStorage.setItem('token', data.token);
      if (!this.isAdminLogin) {
        localStorage.setItem('employeeId', data.employeeId);
      }
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
  
      alert(`✅ Login successful! Welcome ${this.isAdminLogin ? 'Admin' : 'User'}`);
  
      if (data.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/employee-dashboard']);
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '❌ An unexpected error occurred.');
    }
  }
}