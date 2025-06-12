import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  profileData: any = null;
  isSubmitting = false;
  upcomingBirthdays: any[] = []; // New property to hold upcoming birthdays

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {

// Assuming you are using ReactiveFormsModule
this.employeeForm = this.fb.group({
  name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    employeeCode: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    location: [''],
    department: ['', [Validators.required]],
    manager: [''],
    joiningDate: ['', [Validators.required]],
    salary: ['', [Validators.required, Validators.min(1000)]],
    panNumber: ['', [Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    aadharNumber: ['', [Validators.required,Validators.pattern(/^[2-9]{1}[0-9]{11}$/)]],
    branch: [''],
    grade: [''],
    designation: ['', [Validators.required]],
    projectType: [''],
    dateOfBirth: ['', [Validators.required]],
    epsJoiningDate: [''],
    epsExitDate: [''],
    esicNo: ['', [Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
    previousMemberId: ['', Validators.required],
    epsNo: ['', Validators.required]             
});


  }

  ngOnInit(): void {
    this.loadEmployeeProfile();
    this.getUpcomingBirthdays();  // Fetch the upcoming birthdays
  }

  // ✅ Load profile for logged-in user
  private loadEmployeeProfile(): void {
    this.employeeService.getEmployeeProfile();

    this.employeeService.employeeProfile$.subscribe({
      next: (employee) => {
        if (employee) {
          this.profileData = employee;
          this.employeeForm.patchValue({
            ...employee,
            joiningDate: this.formatDate(employee.joiningDate),
            dateOfBirth: this.formatDate(employee.dateOfBirth),
            epsJoiningDate: this.formatDate(employee.epsJoiningDate),
            epsExitDate: this.formatDate(employee.epsExitDate)
          });
          console.log("✅ Profile loaded");
        }
      },
      error: (err: any) => {
        console.error("❌ Error loading profile:", err);
        if (err.status === 401) {
          alert("Session expired. Please login again.");
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // ✅ Fetch upcoming birthdays
  getUpcomingBirthdays(): void {
    this.employeeService.getUpcomingBirthdays().subscribe(
      (data) => {
        this.upcomingBirthdays = data;  // Assign the data to upcomingBirthdays
      },
      (error) => {
        console.error('Error fetching upcoming birthdays:', error);
      }
    );
  }

  // ✅ Submit form (create or update employee)
  submitEmployeeForm(): void {
  if (this.employeeForm.invalid) {
    alert('⚠️ Please fill in all required fields correctly.');
    return;
  }

  this.isSubmitting = true;
  const formData = this.prepareFormData();

  this.http.post('http://localhost:5000/api/employees/add', this.employeeForm.value)
    .subscribe({
      next: () => {
        alert('✅ Employee created:');
        this.employeeForm.reset();
        this.isSubmitting = false;
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        alert(err.error?.message || 'An error occurred while saving employee data.');
        this.isSubmitting = false;
      }
    });
}

loadProfileAfterAdd(id: string) {
  this.employeeService.getEmployeeById(id).subscribe({
    next: (data) => {
      console.log("✅ Loaded newly added profile:", data);
      this.profileData = data;
    },
    error: (err) => {
      console.error("❌ Error fetching new profile:", err);
    }
  });
}

// 🔧 Prepare form data with date format correction
private prepareFormData(): any {
  const raw = { ...this.employeeForm.value };

  const dateFields = ['joiningDate', 'dateOfBirth', 'epsJoiningDate', 'epsExitDate'];
  dateFields.forEach(field => {
    if (raw[field]) {
      raw[field] = new Date(raw[field]).toISOString();
    }
  });

  return raw;
}



  // ✅ Handle image upload
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ File size exceeds 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.employeeForm.patchValue({ imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  // ✅ Format dates for form inputs
  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
}
