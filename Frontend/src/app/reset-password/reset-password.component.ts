import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ⬅️ Import Router

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  submitted = false;
  passwordMismatch = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get email() {
    return this.resetPasswordForm.controls['email'];
  }

  get newPassword() {
    return this.resetPasswordForm.controls['newPassword'];
  }

  get confirmPassword() {
    return this.resetPasswordForm.controls['confirmPassword'];
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordMismatch = false;

    if (this.resetPasswordForm.invalid) return;

    if (this.newPassword.value !== this.confirmPassword.value) {
      this.passwordMismatch = true;
      return;
    }

    const payload = {
      email: this.email.value,
      newPassword: this.newPassword.value,
      confirmPassword: this.confirmPassword.value
    };

    this.http.post<any>('http://localhost:5000/api/reset-password', payload).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.resetPasswordForm.reset();
        this.submitted = false;

        // ✅ Redirect to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Password reset failed.';
      }
    });
  }
}
