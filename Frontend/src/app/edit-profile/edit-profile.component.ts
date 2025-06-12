import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileData: any = {};
  isLoading: boolean = true;
  employeeCode: string = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ No token check, optional now
    this.employeeCode = this.route.snapshot.paramMap.get('id') || '';

    if (this.employeeCode) {
      this.fetchEmployee(this.employeeCode);
    } else {
      alert("❌ No employee code found in route.");
      this.isLoading = false;
    }
  }

  fetchEmployee(code: string): void {
    this.employeeService.getEmployeeByCode(code).subscribe({
      next: (data) => {
        if (data) {
          this.profileData = {
            ...data,
            joiningDate: this.formatDate(data.joiningDate),
            epsJoiningDate: this.formatDate(data.epsJoiningDate),
            epsExitDate: this.formatDate(data.epsExitDate),
            dateOfBirth: this.formatDate(data.dateOfBirth)
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("❌ Error fetching employee:", err);
        alert("Failed to load employee data.");
        this.isLoading = false;
      }
    });
  }

  submitprofile(form: NgForm) {
    if (form.valid) {
      this.employeeService.updateEmployee(this.profileData._id, this.profileData).subscribe({
        next: () => {
          alert('✅ Profile updated successfully!');
          this.router.navigate(['/employee-profile']);
        },
        error: (err) => {
          console.error("❌ Error updating employee:", err);
          alert('❌ Error while updating profile.');
        }
      });
    }
  }

  canceledit(form: NgForm) {
    form.resetForm();
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
}
