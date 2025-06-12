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
    this.loadLatestProfileData();
  }

  private loadLatestProfileData(): void {
    this.isLoading = true;

    this.http.get<any>('http://localhost:5000/api/employees/latest')
      .subscribe({
        next: (response) => {
          this.profileData = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error fetching latest profile:', err);
          this.errorMessage = 'Error fetching profile';
          this.isLoading = false;
        }
      });
  }
}
