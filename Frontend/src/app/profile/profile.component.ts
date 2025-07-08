import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.isLoading = true;
    const employeeCode = localStorage.getItem('employeeId'); // This is actually employeeCode
    if (!employeeCode) {
      this.errorMessage = 'No employee code found in localStorage';
      this.isLoading = false;
      return;
    }

    this.http.get<any>(`http://localhost:5000/api/employees/employee/code/${employeeCode}`)
      .subscribe({
        next: (response) => {
          this.profileData = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error fetching profile:', err);
          this.errorMessage = 'Error fetching profile';
          this.isLoading = false;
        }
      });
  }
}